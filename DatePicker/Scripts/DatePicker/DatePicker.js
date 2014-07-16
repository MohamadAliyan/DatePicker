// TODO: create a method for set date
// TODO: create a method for hiding
// TODO: create a method for showing
var DatePicker;
(function (DatePicker) {
    (function ($) {
        $.fn.datePicker = function (options) {
            //...
            return this.each(function () {
                var $this = $(this);
                var widget;
                if (options) {
                    if (options.dateFormat)
                        widget = new Widget($this, new Model(Globalize.culture(), options.dateFormat), options);
                } else
                    widget = new Widget($this, new Model(Globalize.culture()), options);
                widget.init();
                return widget;
                //...
            });
        };
    })(jQuery);

    var Day = (function () {
        function Day() {
        }
        return Day;
    })();
    DatePicker.Day = Day;

    var Month = (function () {
        function Month() {
        }
        return Month;
    })();
    DatePicker.Month = Month;

    var Year = (function () {
        function Year() {
        }
        return Year;
    })();
    DatePicker.Year = Year;

    var Model = (function () {
        function Model(culture, dateFormat) {
            this.culture = culture;
            this.dateFormat = dateFormat;
            var date = new Date();
            this.selectedYear = this.viewingYear = parseInt(Globalize.format(date, "yyyy"));
            this.selectedMonth = this.viewingMonth = parseInt(Globalize.format(date, "MM"));
            this.selectedDay = parseInt(Globalize.format(date, "dd"));
            this.viewingDecade = this.viewingYear - (this.viewingYear % 10);
            this.viewMode = 1;
        }
        Object.defineProperty(Model.prototype, "yearMonthHeader", {
            get: function () {
                return this.viewingYear + " " + Globalize.culture().calendars.standard.months.namesAbbr[this.viewingMonth - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "yearHeader", {
            get: function () {
                return this.viewingYear;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Model.prototype, "decadeHeader", {
            get: function () {
                return (this.viewingDecade - 1).toString() + " - " + (this.viewingDecade + 1);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Model.prototype, "dayViewDays", {
            get: function () {
                var days = new Array(42);
                if (!Globalize.culture().calendars.standard.convert)
                    var firstDayOfMonthDow = new Date(this.viewingYear, this.viewingMonth - 1, 1).getDay();
                else
                    var firstDayOfMonthDow = (Globalize.culture().calendars.standard.convert.toGregorian(this.viewingYear, this.viewingMonth - 1, 1).getDay());
                var firstDayIndex = (firstDayOfMonthDow + 7 - Globalize.culture().calendars.standard.firstDay) % 7;
                for (var i = 0; i < 42; i++) {
                    var day = new Day();
                    if (!Globalize.culture().calendars.standard.convert)
                        var curDate = new Date(this.viewingYear, this.viewingMonth - 1, i - firstDayIndex + 1);
                    else
                        var curDate = Globalize.culture().calendars.standard.convert.toGregorian(this.viewingYear, this.viewingMonth - 1, i - firstDayIndex + 1);
                    day.value = parseInt(Globalize.format(curDate, "dd")).toString();
                    if (i - firstDayIndex + 1 <= 0)
                        day.isOld = true;
                    var m = parseInt(Globalize.format(curDate, "MM"));
                    if (m > this.viewingMonth || (m == 1 && this.viewingMonth == 12))
                        day.isNew = true;
                    if (this.selectedYear === this.viewingYear && this.selectedMonth === this.viewingMonth && this.selectedDay === i - firstDayIndex + 1)
                        day.isActive = true;
                    var today = new Date();
                    if (curDate.getDate() == today.getDate() && curDate.getFullYear() == today.getFullYear() && curDate.getMonth() == today.getMonth())
                        day.isToday = true;
                    days[i] = day;
                }

                var rows = new Array();
                for (var i = 0; i < 6; i++) {
                    var week = new Array();
                    for (var j = 0; j < 7; j++) {
                        week.push(days[(i * 7) + j]);
                    }
                    rows.push(week);
                }
                return rows;
            },
            enumerable: true,
            configurable: true
        });

        Model.prototype.getDayOfMonth = function (week, dayOfWeek) {
            return 0;
        };

        Object.defineProperty(Model.prototype, "monthViewMonths", {
            get: function () {
                var months = new Array();
                for (var i = 0; i < 12; i++) {
                    var m = new Month();
                    m.value = Globalize.culture().calendars.standard.months.namesAbbr[i];
                    m.isActive = i + 1 == this.selectedMonth;
                    months.push(m);
                }
                return months;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Model.prototype, "yearViewYears", {
            get: function () {
                var years = new Array();
                for (var i = this.viewingDecade - 1; i <= this.viewingDecade + 11; i++) {
                    var y = new Year();
                    y.value = i.toString();
                    y.isActive = i == this.selectedYear;
                    years.push(y);
                }
                return years;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Model.prototype, "selectedDate", {
            get: function () {
                if (this.selectedDay == null && this.selectedMonth == null && this.selectedYear == null)
                    return null;
                if (Globalize.culture().calendars.standard.convert)
                    var d = Globalize.culture().calendars.standard.convert.toGregorian(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
                else
                    var d = (new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay));
                if (this.dateFormat)
                    return Globalize.format(d, this.dateFormat);
                else
                    return Globalize.format(d, "D");
            },
            enumerable: true,
            configurable: true
        });

        Model.prototype.changeSelectedDate = function (date) {
            if (date) {
                var d;
                if (this.dateFormat)
                    d = Globalize.parseDate(date, this.dateFormat);
                else
                    d = Globalize.parseDate(date);
                if (d != null) {
                    this.selectedDay = parseInt(Globalize.format(d, "dd"));
                    this.selectedMonth = this.viewingMonth = parseInt(Globalize.format(d, "MM"));
                    this.selectedYear = this.viewingYear = parseInt(Globalize.format(d, "yyyy"));
                }
            } else {
                this.selectedDay = null;
                this.selectedMonth = null;
                this.selectedYear = null;
            }
        };

        Object.defineProperty(Model.prototype, "viewingMonth", {
            get: function () {
                return this._viewingMonth;
            },
            set: function (value) {
                if (value == 0) {
                    this._viewingMonth = 12;
                    this.viewingYear--;
                } else if (value == 13) {
                    this._viewingMonth = 1;
                    this.viewingYear++;
                } else
                    this._viewingMonth = value;
            },
            enumerable: true,
            configurable: true
        });
        return Model;
    })();
    DatePicker.Model = Model;

    var Widget = (function () {
        function Widget(input, model, options) {
            this.input = input;
            this.model = model;
            this.options = options;
        }
        Widget.prototype.init = function () {
            this.dayViewElm = $('<div class="dorna-datepicker-days"></div>');
            this.monthViewElm = $('<div class="dorna-datepicker-months"></div>');
            this.yearViewElm = $('<div class="dorna-datepicker-years"></div>');

            this.elm = $('<div class="dorna-datepicker dropdown-menu"></div>');
            this.input.parent().prepend(this.elm);
            this.pickerBtn = this.input.siblings("span");

            var widget = this;
            this.input.addClass("datepicker-inline");

            this.input.on("focus", function () {
                widget.placePicker();
            });
            this.input.keyup(function (e) {
                widget.model.changeSelectedDate($(e.target).val());
                widget.renderView();
                if (widget.options != null) {
                    if (widget.options.onSelect != null)
                        widget.options.onSelect(widget.model.selectedDate);
                }
            });

            $(window).on("resize", function () {
                if (widget.elm.hasClass('open'))
                    widget.placePicker();
            });

            $(document).on("mousedown", function (e) {
                var targetElm = $(e.target).closest(".datepicker-inline, .dorna-datepicker.dropdown-menu");
                if (targetElm.length === 0) {
                    widget.removePicker();
                    //widget.elm.fadeOut();
                } else if (!(widget.input.is(targetElm) || widget.elm.is(targetElm))) {
                    widget.removePicker();
                    //widget.elm.fadeOut();
                }
            });

            this.elm.append(this.dayViewElm);
            this.elm.append(this.monthViewElm);
            this.elm.append(this.yearViewElm);
            this.renderView();
        };

        Widget.prototype.renderView = function () {
            this.detachEventhandlers();
            this.initializeViews();
            switch (this.model.viewMode) {
                case 1:
                    this.renderDayView();
                    this.dayViewElm.show();
                    break;
                case 2:
                    this.renderMonthView();
                    this.monthViewElm.show();
                    break;
                case 3:
                    this.renderYearView();
                    this.yearViewElm.show();
                    break;
            }
            this.attachEventHandlers();
        };

        Widget.prototype.initializeViews = function () {
            this.dayViewElm.hide();
            this.dayViewElm.empty();
            this.monthViewElm.hide();
            this.monthViewElm.empty();
            this.yearViewElm.hide();
            this.yearViewElm.empty();
        };

        Widget.prototype.placePicker = function () {
            this.elm.addClass('open');
        };

        Widget.prototype.removePicker = function () {
            this.elm.removeClass('open');
        };

        Widget.prototype.renderDayView = function () {
            var table = $('<table></table>');
            var tHead = $("<thead></thead>");
            var tBody = $("<tbody></tbody>");

            var navigationRow = $("<tr></tr>");
            if (!this.model.culture.isRTL) {
                navigationRow.append($('<th><i class="icon-arrow-left"></th>').addClass("prev"));
                navigationRow.append($("<th></th>").attr("colspan", 5).addClass("switch").text(this.model.yearMonthHeader));
                navigationRow.append($('<th><i class="icon-arrow-right"></th>').addClass("next"));
            } else {
                navigationRow.append($('<th><i class="icon-arrow-right"></th>').addClass("prev"));
                navigationRow.append($("<th></th>").attr("colspan", 5).addClass("switch").text(this.model.yearMonthHeader));
                navigationRow.append($('<th><i class="icon-arrow-left"></th>').addClass("next"));
            }
            tHead.append(navigationRow);

            var dowRow = $("<tr></tr>");
            var firstDay = this.model.culture.calendars.standard.firstDay;
            for (var i = firstDay; i < firstDay + 7; i++) {
                dowRow.append($("<th></th>").addClass("dow").text(this.model.culture.calendars.standard.days.namesShort[i % 7]));
            }
            tHead.append(dowRow);
            table.append(tHead);
            var dayViewDays = this.model.dayViewDays;
            for (var i = 0; i < 6; i++) {
                var tr = $("<tr></tr>");
                for (var j = 0; j < 7; j++) {
                    var td = $("<td></td>").addClass("day");
                    if (dayViewDays[i][j].isOld)
                        td.addClass("old");
                    if (dayViewDays[i][j].isActive)
                        td.addClass("active");
                    if (dayViewDays[i][j].isToday)
                        td.addClass("today");
                    if (dayViewDays[i][j].isNew)
                        td.addClass("new");
                    if (dayViewDays[i][j].isDisabled)
                        td.addClass("disabled");
                    td.text(dayViewDays[i][j].value);
                    tr.append(td);
                }
                tBody.append(tr);
            }
            table.append(tBody);
            this.dayViewElm.append(table);
        };

        Widget.prototype.renderMonthView = function () {
            var table = $('<table class="table-condensed"></table>');
            var tHead = $("<thead></thead>");
            var tBody = $("<tbody></tbody>");

            var navigationRow = $("<tr></tr>");
            if (!this.model.culture.isRTL) {
                navigationRow.append($('<th><i class="icon-arrow-left"></th>').addClass("prev"));
                navigationRow.append($("<th></th>").attr("colspan", 5).addClass("switch").text(this.model.yearHeader));
                navigationRow.append($('<th><i class="icon-arrow-right"></i></th>').addClass("next"));
            } else {
                navigationRow.append($('<th><i class="icon-arrow-right"></i></th>').addClass("prev"));
                navigationRow.append($("<th></th>").attr("colspan", 5).addClass("switch").text(this.model.yearHeader));
                navigationRow.append($('<th><i class="icon-arrow-left"></i></th>').addClass("next"));
            }
            tHead.append(navigationRow);
            table.append(tHead);

            var monthsRow = $("<tr></tr>");
            var td = $("<td></td>").attr("colspan", 7);

            var monthsTable = $("<table></table>");
            for (var r = 0; r < 4; r++) {
                var mTr = $('<tr></tr>');
                for (var c = 0; c < 3; c++) {
                    var mTd = $('<td class="month"></td>');
                    var monthIndex = r * 3 + c;
                    if (this.model.monthViewMonths[monthIndex].isActive)
                        mTd.addClass("active");
                    if (this.model.monthViewMonths[monthIndex].isDisabled)
                        mTd.addClass("disabled");
                    mTd.text(this.model.monthViewMonths[monthIndex].value);
                    mTd.data("month", monthIndex.toString());
                    mTr.append(mTd);
                }
                monthsTable.append(mTr);
            }

            td.append(monthsTable);
            monthsRow.append(td);

            tBody.append(monthsRow);
            table.append(tBody);
            this.monthViewElm.append(table);
        };

        Widget.prototype.renderYearView = function () {
            var table = $("<table></table>").addClass("table-condensed");
            var tHead = $("<thead></thead>");
            var tBody = $("<tbody></tbody>");

            var navigationRow = $("<tr></tr>");
            if (!this.model.culture.isRTL) {
                navigationRow.append($('<th><i class="icon-arrow-left"></i></th>').addClass("prev"));
                navigationRow.append($("<th></th>").attr("colspan", 5).addClass("switch").text(this.model.decadeHeader));
                navigationRow.append($('<th><i class="icon-arrow-right"></i></th>').addClass("next"));
            } else {
                navigationRow.append($('<th><i class="icon-arrow-right"></i></th>').addClass("prev"));
                navigationRow.append($("<th></th>").attr("colspan", 5).addClass("switch").text(this.model.decadeHeader));
                navigationRow.append($('<th><i class="icon-arrow-left"></i></th>').addClass("next"));
            }
            tHead.append(navigationRow);
            table.append(tHead);

            var yearsRow = $("<tr></tr>");
            var td = $('<td colspan="7"></td>');
            var yearsTable = $('<table></table>');
            for (var r = 0; r < 4; r++) {
                var yTr = $('<tr></tr>');
                for (var c = 0; c < 3; c++) {
                    var yTd = $('<td class="year"></td>');
                    var yearIndex = r * 3 + c;
                    if (this.model.yearViewYears[yearIndex].isActive)
                        yTd.addClass("active");
                    if (this.model.yearViewYears[yearIndex].isDisabled)
                        yTd.addClass("disabled");
                    yTd.text(this.model.yearViewYears[yearIndex].value);
                    yTr.append(yTd);
                }
                yearsTable.append(yTr);
            }

            td.append(yearsTable);
            yearsRow.append(td);

            tBody.append(yearsRow);
            table.append(tBody);
            this.yearViewElm.append(table);
        };

        Widget.prototype.attachEventHandlers = function () {
            var widget = this;
            this.elm.find(".next").on("click", function (e) {
                switch (widget.model.viewMode) {
                    case 1:
                        widget.model.viewingMonth++;
                        break;
                    case 2:
                        widget.model.viewingYear++;
                        break;
                    case 3:
                        widget.model.viewingDecade += 10;
                        break;
                }
                widget.renderView();
            });
            this.elm.find(".prev").on("click", function () {
                switch (widget.model.viewMode) {
                    case 1:
                        widget.model.viewingMonth--;
                        break;
                    case 2:
                        widget.model.viewingYear--;
                        break;
                    case 3:
                        widget.model.viewingDecade -= 10;
                        break;
                }
                widget.renderView();
            });
            this.elm.find(".switch").on("click", function () {
                switch (widget.model.viewMode) {
                    case 1:
                        widget.model.viewMode = 2;
                        widget.renderView();
                        break;
                    case 2:
                        widget.model.viewMode = 3;
                        widget.renderView();
                        break;
                }
            });
            this.elm.find(".year").on("click", function () {
                widget.model.viewingYear = parseInt($(this).text());
                widget.model.viewMode = 2;
                widget.renderView();
            });
            this.elm.find(".month").on("click", function () {
                widget.model.viewingMonth = parseInt($(this).data("month")) + 1;
                widget.model.viewMode = 1;
                widget.renderView();
            });
            this.elm.find(".day").on("click", function () {
                var d = $(this);
                widget.model.selectedDay = parseInt(d.text());
                if (d.hasClass("new")) {
                    widget.model.viewingMonth++;
                } else if (d.hasClass("old")) {
                    widget.model.viewingMonth--;
                } else {
                    widget.model.selectedMonth = widget.model.viewingMonth;
                    widget.model.selectedYear = widget.model.viewingYear;
                    widget.input.val(widget.model.selectedDate).trigger("input");
                    widget.removePicker();
                    //widget.elm.fadeOut();
                }
                widget.renderView();
                if (widget.options != null) {
                    if (widget.options.onSelect != null)
                        widget.options.onSelect(widget.model.selectedDate);
                }
            });
            if (this.pickerBtn != null)
                this.pickerBtn.on("click", function () {
                    widget.placePicker();
                });
        };

        Widget.prototype.detachEventhandlers = function () {
            this.elm.find(".next").off("click");
            this.elm.find(".prev").off("click");
            this.elm.find(".day").off("click");
            this.elm.find(".month").off("click");
            this.elm.find(".year").off("click");
            this.elm.find(".switch").off("click");
            if (this.pickerBtn != null)
                this.pickerBtn.off("click");
        };
        return Widget;
    })();
    DatePicker.Widget = Widget;
})(DatePicker || (DatePicker = {}));
//# sourceMappingURL=DatePicker.js.map
