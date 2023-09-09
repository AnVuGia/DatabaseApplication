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