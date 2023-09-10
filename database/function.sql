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
  -- Declare a cursor to fetch rows from PRODUCTWAREHOUSES
  DECLARE cur CURSOR FOR
    SELECT warehouse_id, product_quantity
    FROM PRODUCTWAREHOUSES
    WHERE product_id = productID
    ORDER BY warehouse_id;

  -- Declare handlers for exceptions
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  -- Start a transaction


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
      LEAVE update_loop;
    END IF;

    -- Update available_volume in WAREHOUSES
    UPDATE WAREHOUSES
    SET available_volume = available_volume - quantityChange * productHeight * productWidth * productLength
    WHERE warehouse_id = warehouseID;

  END LOOP;

  CLOSE cur;


END;
//

DELIMITER ;





-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS UpdateUnitOnOrderTrigger;

-- Create the trigger
DELIMITER //
CREATE TRIGGER UpdateUnitOnOrderTrigger
BEFORE UPDATE
ON Products FOR EACH ROW
BEGIN
    IF NEW.unit_in_stock < OLD.unit_in_stock THEN
        CALL UpdateWarehouseData(OLD.unit_in_stock - NEW.unit_in_stock, NEW.product_id);
    END IF;
END;
//
    
DELIMITER ;
