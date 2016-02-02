$(document).ready(function() {
	var items = [],
    	currentItemId = 1,
		ERROR_TYPES = Object.freeze({
            REQUIRED: 'Please enter value for this field.',
            NUMERIC: 'This field must contain only numbers.'
        }),
        $tableHeader = $('#table-container thead');
        
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
    	var $brand = $('#car-brand'),
            $model = $('#car-model'),
            $year = $('#car-year'),
            $kilometers = $('#car-kilometers'),
            
            data = {
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

	toggleTableHeader();

	$("#submit-btn").on('click', function(event) {
  		event.preventDefault();
    
        var data = getAndValidateFormData();
        
        if (data === null) {
        	return;
        }
        
        items.push(data); 
        
        toggleTableHeader();
       
		var $tr = $('<tr/>')
            .attr('data-id', currentItemId) // id for tracking
            .append([
                $('<td/>').text(currentItemId),
                $('<td/>').text(data.brand),
                $('<td/>').text(data.model),
                $('<td/>').text(data.year),
                $('<td/>').text(data.kilometers),
                $('<td/>').html('<a href="#" class="edit-action"><i class="fa fa-pencil-square-o"></i></a>'),
                $('<td/>').html('<a href="#" class="delete-action"><i class="fa fa-times"></i></a>')
            ]);
            
       	$('#table-container table tbody').append($tr);
        
        currentItemId += 1;
        cleanAllInputs();
        
        $('.edit-action').on('click', function (event) {
            event.preventDefault();

            var id = $(this).parents('tr').attr('data-id');
        });

        $('.delete-action').on('click', function (event) {
            event.preventDefault();

            var id = $(this).parents('tr').attr('data-id');

        });
  	});
});