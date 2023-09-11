use lazada_database;
DELIMITER $$
DROP PROCEDURE IF EXISTS warehouse_selection;
CREATE PROCEDURE warehouse_selection(IN p_id INT, product_volume INT, product_quantity INT, OUT success BOOLEAN)
BEGIN  
    DECLARE id INT; 
    DECLARE warehouse_volume INT;  

    DECLARE done INT DEFAULT FALSE;  

    DECLARE num_product INT;

    DECLARE row_count INT DEFAULT 0;

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

        SELECT COUNT(*) INTO row_count
        FROM ProductWarehouses
        WHERE product_id = p_id AND warehouse_id = id;

        IF row_count > 0 THEN
            UPDATE ProductWarehouses p
            SET p.product_quantity = p.product_quantity + num_product
            WHERE product_id = p_id AND warehouse_id = id;

        ELSE
            INSERT INTO ProductWarehouses(product_id, warehouse_id, product_quantity)
                    VALUES(p_id, id, num_product);
        END IF;

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

-- function move product from one to another warehouse
DELIMITER $$
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

    -- Set the transaction isolation level to SERIALIZABLE
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    
    START TRANSACTION;

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
        IF avai_quantity = quantity THEN
			DELETE FROM ProductWarehouses
            WHERE  ProductWarehouses.product_id = productID
            AND ProductWarehouses.warehouse_id = wid_start;
        ELSE
			UPDATE ProductWarehouses
			SET product_quantity = product_quantity - quantity
			WHERE ProductWarehouses.product_id = productID
			AND ProductWarehouses.warehouse_id = wid_start;
        END IF;
        
        SET success = true;
    END IF;
    COMMIT;
END $$
DELIMITER ;


-- Drop the procedure if it exists
DROP PROCEDURE IF EXISTS UpdateWarehouseData;

-- Create the procedure for updating warehouse-related data
DELIMITER //

CREATE PROCEDURE UpdateWarehouseData(
  IN quantityChange INT,
  IN productID INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE warehouseID INT;
    DECLARE quantityInWarehouse INT; -- Declare a local variable
    DECLARE productHeight INT;
    DECLARE productWidth INT;
    DECLARE productLength INT;
    DECLARE volumeChange INT;
	    -- Declare a cursor to fetch rows from PRODUCTWAREHOUSES
    DECLARE cur CURSOR FOR
        SELECT pw.warehouse_id, pw.product_quantity, p.height, p.width, p.length
        FROM PRODUCTWAREHOUSES pw
        JOIN Products p ON pw.product_id = p.product_id
        WHERE pw.product_id = productID
        ORDER BY pw.warehouse_id;
        
    -- Declare handlers for exceptions
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- An error occurred, rollback the transaction
        ROLLBACK;
    END;

	    -- Set the transaction isolation level to SERIALIZABLE
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    
    START TRANSACTION;
    OPEN cur;

    update_loop: LOOP
        FETCH cur INTO warehouseID, quantityInWarehouse,  productHeight, productWidth, productLength; -- Use the local variable

        IF done THEN
            LEAVE update_loop;
        END IF;

        IF quantityChange > quantityInWarehouse THEN
            -- Reduce quantity in the current warehouse to 0
            UPDATE PRODUCTWAREHOUSES
            SET product_quantity = 0
            WHERE product_id = productID AND warehouse_id = warehouseID;
        ELSE
            -- Reduce quantity in the current warehouse by quantityChange
            UPDATE PRODUCTWAREHOUSES
            SET product_quantity = product_quantity - quantityChange
            WHERE product_id = productID AND warehouse_id = warehouseID;
        END IF;
        
        -- Calculate the change in available_volume based on quantityChange and product dimensions
        SET volumeChange = quantityChange * productHeight * productWidth * productLength;
        
        -- Update available_volume in WAREHOUSES
        UPDATE WAREHOUSES
        SET available_volume = available_volume + volumeChange
        WHERE warehouse_id = warehouseID;

    END LOOP;

    CLOSE cur;

    -- Commit the transaction if all updates were successful
    COMMIT;
    
    -- Rollback the transaction if there was an error (handled by EXIT HANDLER)
    
END;
//

DELIMITER ;



-- create product warehouse view for moving product easily
DROP VIEW IF EXISTS product_warehouse_view;
CREATE VIEW product_warehouse_view AS
SELECT ph.warehouse_id, 
		w.warehouse_name,
		w.available_volume, 
        p.product_name, 
        ph.product_id, 
        ph.product_quantity
FROM productWarehouses ph
JOIN warehouses w
ON ph.warehouse_id = w.warehouse_id
JOIN products p
ON ph.product_id = p.product_id;