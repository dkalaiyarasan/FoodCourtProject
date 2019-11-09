const $tableID = $('#table-admin');

const newTr = `
<tr class="hide">
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half">
    <span class="table-up"><a href="#!" class="indigo-text"><i class="fas fa-long-arrow-alt-up" aria-hidden="true"></i></a></span>
    <span class="table-down"><a href="#!" class="indigo-text"><i class="fas fa-long-arrow-alt-down" aria-hidden="true"></i></a></span>
  </td>
  <td>
    <span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 waves-effect waves-light">Remove</button></span>
  </td>
</tr>`;

$('.table-add').on('click', 'i', () => {
    const $clone = $tableID.find('tbody tr').last().clone(true).removeClass('hide table-line').addClass("cloned");
    if ($tableID.find('tbody tr').length === 0) {
        $('tbody').append(newTr);
    }
    $clone.find(".productid").remove();
    $tableID.find('table').append($clone);
});

$tableID.on('click', '.table-save', function () {
    var parent = $(this).parents('tr');
    var obj = {
        title: parent.find(".title").text(),
        imagepath: parent.find(".imagepath").text(),
        description: parent.find(".description").text(),
        menu: parent.find(".menu").text(),
        price: parent.find(".price").text(),
        quantity: parent.find(".quantity").text(),
        id: parent.find(".productid").val()
    };

    $.ajax({
        type: "POST",
        url: "/update",
        data: obj,
        headers: {
            'x-csrf-token': $tableID.find(".csrf").val()
        },
        success: function (res) {
            parent.removeClass("cloned");
        },
        error: function (e) {
            console.log("ERROR", e);
        }
    });
});