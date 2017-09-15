(function ($) {

    $.fn.hasAttr = function (name) {
        return this.attr(name) !== undefined;
    };

    'use strict';

    var dynamicTable = function (element, options) {
        debugger;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.dynamicTable.defaults, options);
        this.getDataSource();
        return this;
    };

    dynamicTable.prototype = {

        constructor: dynamicTable,

        init: function (options) {
            var a = this.getHeaders(options);
            this.getTable(options, a);
        },
        load: function (data) {
            var headers;
            if (!this.options.initialized) {
                this.options.initialized = true;
                headers = this.getHeaders(data);
            } else {
                headers = this.$element.find('thead');
            }

            var table = $('<table class="' + this.options.tableClass + '"></table>');
            var rows = this.getRows(data, headers);
          
            table.append(headers);
            table.append(rows);

            this.$element.html(table);
            this.initializeEvents();
        },
        getHeaders: function (obj) {
            var th = $('<thead><tr></tr></thead>');
            for (var key in obj[0]) {
                if (obj[0].hasOwnProperty(key)) {
                    var columnName = key;
                    th.append('<th data-column-name="' + columnName + '">' + columnName + '</th>');
                }
            }

            return th;
        },
        getRows: function (obj) {
            var trs = $('<tbody></tbody>');
            for (c = 0; c <= obj.length; c++) {
                var tr = $('<tr></tr>');
                for (var i in obj[c]) {
                    tr.append('<td>' + obj[c][i] + '</td>');
                }
                trs.append(tr);
            }

            return trs
        },
        getDataSource: function () {
            var $this = this;
            $.ajax({
                url: $this.options.listAction,
                type: 'POST',
                data: JSON.stringify($this.options.dataSource),
                contentType: "application/json",
                success: function (data) {
                    $this.load(data);
                }
            });
        },
        initializeEvents: function () {
            var element = this;
            $('th[data-column-name]').off('click').on('click', function (data) {
                var $this = $(this);
                var $desc = '<span class="glyphicon glyphicon-triangle-bottom"></span>';
                var $asc = '<span class="glyphicon glyphicon-triangle-top"></span>';
                if ($this.hasAttr('data-column-name')) {
                    $('th > .glyphicon').remove();
                    if ($this.hasAttr('data-sort-type')) {
                        if ($this.attr('data-sort-type') == 'asc') {
                            $this.attr('data-sort-type', 'desc');
                            $this.append($desc);
                        } else if ($this.attr('data-sort-type') == 'desc') {
                            $this.attr('data-sort-type', 'asc');
                            $this.append($asc);
                        }
                    } else {
                        $('th[data-sort-type]').removeAttr('data-sort-type');
                        $this.attr('data-sort-type', 'desc');
                        $this.append($desc);
                    }
                };
                element.getDataSource();
            });
        }
    };

    $.fn.dynamicTable = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);
        var data = $this.data('dynamic-table');
        var options = typeof option === 'object' ? option : {};

        if (!data) $this.data('dynamic-table', (data = new dynamicTable(this, options)));
        if (typeof option === 'string') methodReturn = data[option].apply(data, args);

        return (methodReturn === undefined) ? $this : methodReturn;
    };

    $.fn.dynamicTable.defaults = {
        listAction: "",
        tableClass: "r-custom-table r-custom-table-auto text-center r-multiple-checkbox-handler",
        initialized: false
    };

    $.fn.dynamicTable.Constructor = dynamicTable;


})(jQuery);