'use strict';

describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });



  it('should return decoded barcode given valid tags', () =>{
    const tags = [
      'ITEM000003-2',
      'ITEM000005-2',
    ];
    const actualResult = [
      {
        barcode : 'ITEM000003',
        count : 2
      },
      {
        barcode : 'ITEM000005',
        count : 2
      }
    ];
    const result = decodeBarcode(tags);
    expect(result).toBe(actualResult);
  });

  it('should load items given valid barcodes', () =>{
    const decodedBarcodes = [
      {
        barcode : 'ITEM000003',
        count : 2
      },
      {
        barcode : 'ITEM000005',
        count : 2
      }
    ];
    const itemsWithoutCount = [
      {
        barcode: 'ITEM000003',
        name: 'Litchi',
        unit: 'pound',
        price: 15.00
      },
      {
        barcode: 'ITEM000005',
        name: 'Instant Noodles',
        unit: 'bag',
        price: 4.50
      }
    ];

    const result = loadItems(decodedBarcodes);
    expect(result).toBe(itemsWithoutCount);
  });

  it('should combine items given valid decoded barcodes', () =>{
      const decodedBarcodes = [
        {
          barcode : 'ITEM000003',
          count : 2
        },
        {
          barcode : 'ITEM000005',
          count : 2
        }
      ];
      const items = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2
        }
      ];

      const result = combineItems(decodedBarcodes);
      expect(result).toBe(items);
    });

    it('should return items given valid tags', () =>{
      const tags = [
        'ITEM000003-2',
        'ITEM000005-2',
      ];

      const items = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2
        }
      ];

      const result = decodeTags(tags);
      expect(result).toBe(items);
    });

    it('should load promotions', () =>{
      const actualResult = [
        {
          type: 'BUY_TWO_GET_ONE_FREE',
          barcodes: [
            'ITEM000000',
            'ITEM000001',
            'ITEM000005'
          ]
        }
      ];

      expect(loadPromotions()).toBe(actualResult);
    });

    it('should return receipt items given items and promotions', () =>{
      const items = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2
        }
      ];

      const promotions = [
        {
          type: 'BUY_TWO_GET_ONE_FREE',
          barcodes: [
            'ITEM000000',
            'ITEM000001',
            'ITEM000005'
          ]
        }
      ];

      const receiptItems = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2, 
          subtotal: 30.00
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2,
          subtotal: 4.50
        }
      ];
      const result = promoteReceiptItems(items, promotions);
      expect(result).toBe(receiptItems);
    });

    it('should return receipt items given items', () => {
      const items = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2
        }
      ];

      const receiptItems = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2, 
          subtotal: 30.00
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2,
          subtotal: 4.50
        }
      ];

      expect(calculateReceiptItems(items)).toBe(receiptItems);
    });

    it('should return total given receipt items', () =>{
      const receiptItems = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2, 
          subtotal: 30.00
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2,
          subtotal: 4.50
        }
      ];
      
      const result = calculateReceiptTotal(receiptItems);
      expect(result).toBe(34.50);
    });

    it('should return receipt saving given receipt items', () =>{
      const receiptItems = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2, 
          subtotal: 30.00
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2,
          subtotal: 4.50
        }
      ];

      const result = calculateReceiptSaving(receiptItems);
      expect(result).toBe(4.50);
    });

    it('should return receipt given items', () =>{
      const receiptItems = [
        {
          barcode: 'ITEM000003',
          name: 'Litchi',
          unit: 'pound',
          price: 15.00,
          count:  2, 
          subtotal: 30.00
        },
        {
          barcode: 'ITEM000005',
          name: 'Instant Noodles',
          unit: 'bag',
          price: 4.50,
          count: 2,
          subtotal: 4.50
        }
      ];

      const receipt = {
          receiptItems : [
            {
              barcode: 'ITEM000003',
              name: 'Litchi',
              unit: 'pound',
              price: 15.00,
              count:  2, 
              subtotal: 30.00
            },
            {
              barcode: 'ITEM000005',
              name: 'Instant Noodles',
              unit: 'bag',
              price: 4.50,
              count: 2,
              subtotal: 4.50
            }
          ],
          total : 34.50,
          saving : 4.50
      };

      const result = calculateReceipt(receiptItems);
      expect(result).toBe(receipt);
    });

    it('should return formatted receipt given receipt', () =>{
      const receipt = {
        receiptItems : [
          {
            barcode: 'ITEM000003',
            name: 'Litchi',
            unit: 'pound',
            price: 15.00,
            count:  2, 
            subtotal: 30.00
          },
          {
            barcode: 'ITEM000005',
            name: 'Instant Noodles',
            unit: 'bag',
            price: 4.50,
            count: 2,
            subtotal: 4.50
          }
        ],
        total : 34.50,
        saving : 4.50
    };

    let formattedReceipt ='***<store earning no money>Receipt ***';
    formattedReceipt += 'Name：Litchi，Quantity：2 pounds，Unit：15.00(yuan)，Subtotal：30.00(yuan)';
    formattedReceipt += 'Name：Instant Noodles，Quantity：2 bags，Unit：4.50(yuan)，Subtotal：4.50(yuan)';
    formattedReceipt += '----------------------';
    formattedReceipt += 'Total：34.50(yuan)';
    formattedReceipt += 'Discounted prices：4.50(yuan)';
    formattedReceipt += '**********************';
    });

    const result = renderReceipt(receipt);

    expect(result).toBe(formattedReceipt);
  });





