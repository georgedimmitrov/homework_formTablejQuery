$(document).ready(function() {

    var loadItemsFromLocalStorage = function () {
        if (typeof Storage === undefined) {
            console.log('Sorry, you don\'t seem to have local storage');
            return []; 
        }

        var items = localStorage.getItem('items');
        if (items) {
            return JSON.parse(items).items;
        }

        return [];
    };

    var saveItemsToLocalStorage = function (items) {
        localStorage.setItem('items', JSON.stringify({ items: items}));
    };

    var items = loadItemsFromLocalStorage(),
        ERROR_TYPES = Object.freeze({
            REQUIRED: 'Please enter value for this field.',
            NUMERIC: 'This field must contain only numbers.'
        }),
        $tableHeader = $('#table-container thead'),
        $tableBody = $('#table-container table tbody'),
        $brand = $('#car-brand'),
        $model = $('#car-model'),
        $year = $('#car-year'),
        $kilometers = $('#car-kilometers'),
        isEditing = false;
        
    var toggleTableHeader = function () {
        if (items.length === 0) {
            $tableHeader.hide();
        } else {
            $tableHeader.show();
        }
    };
    
    var clearAllErrors = function () {
        $('.error').remove();
    };
    
    var cleanAllInputs = function () {
        $('input').val('');
    };
    
    var getAndValidateFormData = function () {
        
        var data = {
                brand: $brand.val(),
                model: $model.val(),
                year: $year.val(),
                kilometers: $kilometers.val()
            },

            isValid = false;

        clearAllErrors();
        
        var $error = $('<span/>').attr('class', 'error'),
            $errorFieldRequired = $error.text(ERROR_TYPES.REQUIRED).clone(),
            $errorNumeric = $error.text(ERROR_TYPES.NUMERIC).clone();
        
        if (data.brand === '') {
            $brand.after($errorFieldRequired.clone());
        }

        if (data.model === '') {
            $model.after($errorFieldRequired.clone());
        }
        
        if (data.year === '') {
            $year.after($errorFieldRequired.clone());
        }
        
        if (data.kilometers === '') {
            $kilometers.after($errorFieldRequired.clone());
        }
        
        var numericRegex = /^\d+$/;
        
        if (data.year !== '' && !numericRegex.test(data.year)) {
            $year.after($errorNumeric.clone());
        }
        
        if (data.kilometers !== '' && !numericRegex.test(data.kilometers)) {
            $kilometers.after($errorNumeric.clone());
        }

        if ($('#form-container .error').length > 0) {
            return null;
        }

        return data;
    };

    var reRenderItems = function (items, container) {

        var currentItemCounter = 0,
            $trs = items.map(function (item) {
                currentItemCounter++;
                return $('<tr/>')
                    .attr('data-id', item.id) // id for tracking
                    .append([
                        $('<td/>').text(currentItemCounter),
                        $('<td/>').text(item.brand),
                        $('<td/>').text(item.model),
                        $('<td/>').text(item.year),
                        $('<td/>').text(item.kilometers),
                        $('<td/>').html('<a href="#" class="edit-action"><i class="fa fa-pencil-square-o"></i></a>'),
                        $('<td/>').html('<a href="#" class="delete-action"><i class="fa fa-times"></i></a>')
                    ]);
            });
        
        container.html($trs);
    };

    var deleteItemById = function (id, items) {
        return items.filter(function (item) {
            return item.id != id;
        });
    };

    var findItemById = function (id, items) {
        return items.filter(function (item) {
            return item.id == id;
        })[0];
    };

    var loadItemDataInInput = function (item) {
        $brand.val(item.brand);
        $model.val(item.model);
        $year.val(item.year);
        $kilometers.val(item.kilometers);
    };

    var updateItemById = function (updatedItem, items) {
        return items.map(function (item) {
            if (item.id == updatedItem.id) {
                return $.extend(item, updatedItem);
            } 

            return item;
        });
    };

    toggleTableHeader();
    reRenderItems(items, $tableBody);

    $("#submit-btn").on('click', function(event) {
        event.preventDefault();
    
        var data = getAndValidateFormData();
        
        if (data === null) {
            return;
        }
        
        if (isEditing) {
            data.id = isEditing;
            items = updateItemById(data, items);
            isEditing = false;
        } else {
            data.id = new Date().getTime();
            items.push(data);
        }
        
        toggleTableHeader();

        reRenderItems(items, $tableBody);
        
        cleanAllInputs();
        
        saveItemsToLocalStorage(items);

        $('.edit-action').on('click', function (event) {
            event.preventDefault();

            var id = $(this).parents('tr').attr('data-id'),
                item = findItemById(id, items);

            // fill the inputs with the data
            loadItemDataInInput(item);
            isEditing = id;

        });

        $('.delete-action').on('click', function (event) {
            event.preventDefault();

            var id = $(this).parents('tr').attr('data-id');
            
            items = deleteItemById(id, items);

            reRenderItems(items, $tableBody);
        });
    });
});