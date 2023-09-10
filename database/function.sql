DELIMITER $$
DROP PROCEDURE IF EXISTS warehouse_selection;
CREATE PROCEDURE warehouse_selection(IN p_id INT, product_volume INT, product_quantity INT, OUT success BOOLEAN)
BEGIN  
    DECLARE id INT; 
    DECLARE warehouse_volume INT;  

    DECLARE done INT DEFAULT FALSE;  

    DECLARE num_product INT;

    DECLARE cur CURSOR FOR SELECT warehouse_id, available_volume FROM warehouses ORDER BY available_volume DESC;  

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;  

    START TRANSACTION;  

    OPEN cur;  

    read_loop: LOOP  
        FETCH cur INTO id, warehouse_volume;  
        IF done THEN  
            LEAVE read_loop;  
        END IF;  

        SET num_product = 0;

        while_loop: WHILE warehouse_volume >= product_volume DO  
            SET warehouse_volume = warehouse_volume - product_volume;

            SET product_quantity = product_quantity - 1;
            
            SET num_product = num_product + 1;

            IF product_quantity = 0  THEN
                SET success = TRUE;  

                SET done = TRUE;

                LEAVE while_loop;
                LEAVE read_loop;
            END IF;  

        END WHILE while_loop;

        UPDATE warehouses
        SET available_volume = warehouse_volume
        WHERE warehouse_id = id;

        INSERT INTO ProductWarehouses(product_id, warehouse_id, product_quantity)
                    VALUES(p_id, id, num_product);

    END LOOP;  

    IF product_quantity > 0 THEN  
        ROLLBACK;  
        SET success = FALSE;  
    END IF;  

    IF product_quantity = 0  THEN
        COMMIT;
    END IF;  

    CLOSE cur;  

END $$
DELIMITER ;



-- Move product procedure
DELIMITER $$
DROP PROCEDURE IF EXISTS move_product;
CREATE PROCEDURE move_product(IN wid_start BIGINT, 
                            IN productID BIGINT,
                            IN wid_dest BIGINT, 
                            IN volume INTEGER, 
                            IN quantity INTEGER,
                            OUT success BOOLEAN)
BEGIN
    -- Declare variables
    DECLARE avai_volume INTEGER;
    DECLARE avai_quantity INTEGER;

    -- Get the available volume in the source warehouse
    SELECT ProductWarehouses.product_quantity
    INTO avai_quantity
    FROM ProductWarehouses
    WHERE warehouse_id = wid_start
    AND ProductWarehouses.product_id = productID;

    -- Get the available volume in the destination warehouse
    SELECT available_volume
    INTO avai_volume
    FROM warehouses
    WHERE warehouse_id = wid_dest;

    IF avai_volume < volume OR avai_quantity < quantity THEN
        -- Code to execute if the condition is true
        SET success = false;
    ELSE
        -- Code to execute if the condition is false

        -- Subtract available volume in the destination warehouse
        UPDATE warehouses 
        SET available_volume = available_volume - volume
        WHERE warehouse_id = wid_dest;

        -- Add available volume in the source warehouse
        UPDATE warehouses 
        SET available_volume = available_volume + volume
        WHERE warehouse_id = wid_start;

        -- Check if a row exists in ProductWarehouses for the destination
        -- If no row exists, insert a new row
        IF NOT EXISTS (SELECT 1 FROM ProductWarehouses WHERE product_id = productID AND warehouse_id = wid_dest) THEN
            INSERT INTO ProductWarehouses (product_id, warehouse_id, product_quantity)
            VALUES (productID, wid_dest, quantity);
        ELSE
            -- Update the quantity in the destination ProductWarehouses
            UPDATE ProductWarehouses
            SET product_quantity = product_quantity + quantity
            WHERE ProductWarehouses.product_id = productID
            AND ProductWarehouses.warehouse_id = wid_dest;
        END IF;

        -- Subtract the quantity from the source ProductWarehouses
        UPDATE ProductWarehouses
        SET product_quantity = product_quantity - quantity
        WHERE ProductWarehouses.product_id = productID
        AND ProductWarehouses.warehouse_id = wid_start;

        SET success = true;
        COMMIT;
    END IF;
END $$
DELIMITER ;