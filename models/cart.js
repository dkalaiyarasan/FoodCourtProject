module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            }
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };
    this.remove = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id]
    };
    this.update = function (id, qty) {
        var storedItem = this.items[id];
        var quantityDifference = Math.abs(storedItem.qty - qty);
        if (storedItem.qty > qty) {
            this.totalQty -= quantityDifference;
            this.totalPrice -= (storedItem.item.price * quantityDifference);
        }
        if (qty > storedItem.qty) {
            this.totalQty += quantityDifference;
            this.totalPrice += (storedItem.item.price * quantityDifference);
        }
        storedItem.qty = qty;
        storedItem.price = storedItem.qty * storedItem.item.price;
    };
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};