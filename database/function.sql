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



DROP PROCEDURE IF EXISTS accept_order;

-- Create the procedure
DELIMITER //

CREATE PROCEDURE accept_order(
  IN orderID BIGINT
)
BEGIN
  DECLARE currentStock INT;
  DECLARE currentOrder INT;
  DECLARE warehouseID BIGINT; -- Declare a variable for warehouse_id
  DECLARE quantityChange INT;
  DECLARE productID BIGINT; -- Declare a variable for product_id

  -- Get the order quantity and product
  SELECT quantity, product_id INTO quantityChange, productID
  FROM orders
  WHERE order_id = orderID;

  -- Get the current values of unit_in_stock and unit_on_order
  SELECT unit_in_stock, unit_on_order INTO currentStock, currentOrder
  FROM Products
  WHERE product_id = productID;

  -- Update unit_in_stock and calculate unit_on_order
  UPDATE Products 
  SET unit_in_stock = currentStock - quantityChange,
      unit_on_order = currentOrder + quantityChange
  WHERE product_id = productID;
  
  -- Update PRODUCTWAREHOUSES and assign warehouse_id to a variable
  UPDATE PRODUCTWAREHOUSES 
  SET quantity = quantity - quantityChange,
      warehouse_id = (SELECT warehouse_id FROM PRODUCTWAREHOUSES WHERE product_id = productID AND quantity > quantityChange LIMIT 1)
  WHERE product_id = productID
  AND quantity > quantityChange
  LIMIT 1;
  
  -- Retrieve the assigned warehouse_id into the variable
  SELECT warehouse_id INTO warehouseID FROM PRODUCTWAREHOUSES WHERE product_id = productID AND quantity > quantityChange LIMIT 1;
  
  -- Update WAREHOUSES
  UPDATE WAREHOUSES
  SET available_volume = available_volume + quantityChange
  WHERE warehouse_id = warehouseID; -- Use the variable here
END;
//
DELIMITER ;





DROP trigger if exists UpdateUnitOnOrderTrigger;
-- Create a trigger to automatically call the procedure when unit_in_stock is updated
DELIMITER //
CREATE TRIGGER UpdateUnitOnOrderTrigger
before DELETE
ON Orders FOR EACH ROW
BEGIN
    CALL UpdateWarehouseData(order_id);
END;
//

DELIMITER ;

-- Drop the procedure if it exists
DROP PROCEDURE IF EXISTS ReverseStockAndOrder;

-- Create the procedure
DELIMITER //

CREATE PROCEDURE ReverseStockAndOrder(
  IN orderID BIGINT
)
BEGIN
  DECLARE productID BIGINT;
  DECLARE quantityChange INT;

  -- Get the product and quantity from the order
  SELECT product_id, quantity INTO productID, quantityChange
  FROM orders
  WHERE order_id = orderID;

  -- Update unit_in_stock and unit_on_order in the Products table
  UPDATE Products 
  SET unit_in_stock = unit_in_stock + quantityChange,
      unit_on_order = unit_on_order - quantityChange
  WHERE product_id = productID;
  END;
//

DELIMITER ;