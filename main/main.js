'use strict';

function decodeBarcode(tags){
    let decodedBarcode = [];
    for(var element of tags)
    {
        let splitValues = element.split('-');
        decodedBarcode.push({
            barcode : splitValues[0],
            count : parseInt(splitValues[1])
        });
    }
    return decodedBarcode;
}

function loadItems(decodedBarcodes){
    let items = loadAllItems();
    let filteredItems = [];

    for(var element of items){
        for(var barcode of decodedBarcodes){
            if(element.barcode == barcode.barcode){
                filteredItems.push(element);
            }
        }
    }
    return filteredItems;
}

function combineItems(decodedBarcodes){
    let filteredItems = loadItems(decodedBarcodes);
    let itemsWithCount = [];
    for(var element of filteredItems){
        for(var barcode of decodedBarcodes){
            if(element.barcode == barcode.barcode){
                itemsWithCount.push({
                    barcode: element.barcode,
                    name: element.name,
                    unit: element.unit,
                    price: element.price,
                    count:  barcode.count
                  });
            }
        }
    }
    return itemsWithCount;
}

function decodeTags(tags){
    return combineItems(decodeBarcode(tags));
}

function promoteReceiptItems(items, promotions){
    let subTotal;
    let receiptItems = [];
    for(var item of items){
        for(var promotion of promotions){
            if(promotion.type == 'BUY_TWO_GET_ONE_FREE' && promotion.barcodes.includes(item.barcode)){
                subTotal = getSubTotalWithDiscount(item.price, item.count);
            }
            else{
                subTotal = item.price * item.count;
            }
            receiptItems.push({
                barcode: item.barcode,
                name: item.name,
                unit: item.unit,
                price: item.price,
                count:  item.count, 
                subtotal: subTotal
              });
        }
    }
    return receiptItems;
}

function getSubTotalWithDiscount(price, count){
    let total = price * count;
    let subTotal;
    if(count > 1){
        let discount = Math.floor(count/2);
        subTotal = total - (price * discount);
    }
    else{
        subTotal = total;
    }
    return subTotal;
}

function calculateReceiptItems(receiptItems){
    return promoteReceiptItems(receiptItems, loadPromotions());
}

function calculateReceiptTotal(receiptItems){
    return receiptItems.map(item => item.subtotal).reduce((a ,b) => a + b);
}

function calculateReceiptSaving(receiptItems){
    let total = receiptItems.map(item => item.price * item.count).reduce((a, b) => a + b);
    return total - calculateReceiptTotal(receiptItems);
}

function calculateReceipt(receiptItems){
    let total = calculateReceiptTotal(receiptItems);
    let saving = calculateReceiptSaving(receiptItems);

    let receipt = {
        receiptItems : receiptItems,
        total: total,
        saving:saving
    };

    return receipt;
}

function renderReceipt(receipt){
    let formattedReceipt ='***<store earning no money>Receipt ***';
    for(var item of receipt.receiptItems){
        formattedReceipt += 'Name：'+ item.name +'，Quantity：'+ item.count +' '+ item.unit +'s，Unit：'+ item.price.toFixed(2) +'(yuan)，Subtotal：'+ item.subtotal.toFixed(2) +'(yuan)';
    }
    formattedReceipt += '----------------------';
    formattedReceipt += 'Total：'+ receipt.total.toFixed(2) +'(yuan)';
    formattedReceipt += 'Discounted prices：'+ receipt.saving.toFixed(2) +'(yuan)';
    formattedReceipt += '**********************';

    return formattedReceipt;
}

function printReceipt(tags){
    let items = decodeTags(tags);
    return renderReceipt(calculateReceipt(calculateReceiptItems(items)));
}