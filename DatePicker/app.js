Globalize.culture('fa-IR');
$('#datepicker').datePicker({
    onSelect: function (date) {
        console.log(date);
    },
    dateFormat: "D"
});
