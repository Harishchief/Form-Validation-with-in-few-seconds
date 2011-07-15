(function($) {

    /*************************************************************************************************************************************
    Declare Variables and static classes
    **************************************************************************************************************************************/
    var ClassNameWithoutDot = {
        required: "required",
        validationError: "validation-error"
    }

    var ClassName = {
        required: ".required",
        numeric: ".numeric",
        alphabetic: ".alphabetic",
        alphanumeric: ".alphanumeric",
        email: ".email",
        mutipleSelection: ".mutiple-selection",
        validationError: ".validation-error"
    };

    var AttributeName = {
        required: "requiredfieldname"
    };

    //Custom Message
    var Messages = {
        required: "{0} is required.",
        email: "Please enter a valid email address.",
        blank: "",
        thisField: "This Field"
    };

    //Regular Expression
    var RegularExpression = {
        Numeric: /^\d+$/,
        Alphabetic: /^\D+$/,
        AlphaNumeric: /^\w+$/,
        Email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        Required: /^.+$/
    };

    /*************************************************************************************************************************************
    Public Methods 
    **************************************************************************************************************************************/

    $.fn.IsValid = function() {
        return IsFoundError(this);
    };

    $.fn.KeyFilter = function() {
        keyfilter(this);
    };

    $.fn.Validation = function() {

        // Remove the error class
        (this).find(ClassName.validationError).removeClass(ClassNameWithoutDot.validationError);

        // Required for textbox,password and combo-box
        (this).find(ClassName.required).each(function() {

            // Declare the variable
            var ele = $(this);
            var type = ele.attr("type");
            var isRequiredFieldEmpty = false;


            switch (type) {
                case "password":
                case "text":
                    if (ele.val() == Messages.blank)
                        isRequiredFieldEmpty = true;
                    break;

                case "select-multiple":
                case "select-one":
                    if ($(ele).val() == "0" || $(ele).val() == "" || $(ele).val() == null) {
                        isRequiredFieldEmpty = true;
                    }
                    break;
            }

            if (isRequiredFieldEmpty)
                ShowInformativeMessage(ele);
            else
                HideInformativeMessage(ele);
        });

        // Required for radio and checkbox control
        (this).find(ClassName.mutipleSelection).each(function() {
            // Declare the variable
            var ele = $(this);
            var radio_count = ele.find("input:radio").length;
            var checkbox_count = ele.find("input:checkbox").length;

            if (radio_count > 0 && checkbox_count > 0)
                alert('You can\'t place more than 1 control in same container');
            else {

                if (ele.attr("class").indexOf(ClassNameWithoutDot.required) > 0) {

                    var isRequiredFieldEmpty = false;

                    if (ele.find("input:checked").length == 0)
                        isRequiredFieldEmpty = true;

                    if (isRequiredFieldEmpty)
                        ShowInformativeMessage(ele);
                    else
                        HideInformativeMessage(ele);
                }
            }
        });

        /* Numeric */
        (this).find(ClassName.numeric).each(function() {
            if ($(this).val().length > 0)
                IsValidation(this, RegularExpression.Numeric, true);
        });

        /* Alphabetic */
        (this).find(ClassName.alphabetic).each(function() {
            if ($(this).val().length > 0)
                IsValidation(this, RegularExpression.Alphabetic, true);
        });

        /* AlphaNumeric */
        (this).find(ClassName.alphanumeric).each(function() {
            if ($(this).val().length > 0)
                IsValidation(this, RegularExpression.AlphaNumeric, true);
        });

        /* Email-Id */
        (this).find(ClassName.email).each(function() {
            if ($(this).val().length > 0)
                IsValidation(this, RegularExpression.Email, true);
        });

        if (IsFoundError(this))
            return true;
        else {
            keyfilter(this);
            return false;
        }
    };

    /*************************************************************************************************************************************
    Helping Methods 
    **************************************************************************************************************************************/

    //Attach the events (keyup and keypress)
    function keyfilter(ele) {

        /* Required */
        (ele).find(ClassName.required).bind("keyup keypress", function() {
            IsValidation(this, RegularExpression.Required, true);
        });

        /* Numeric */
        (ele).find(ClassName.numeric).bind("keyup keypress", function() {
            IsValidation(this, RegularExpression.Numeric, false);
        });

        /* Alphabetic */
        (ele).find(ClassName.alphabetic).bind("keyup keypress", function() {
            IsValidation(this, RegularExpression.Alphabetic, false);
        });

        /* AlphaNumeric */
        (ele).find(ClassName.alphanumeric).bind("keyup keypress", function() {
            IsValidation(this, RegularExpression.AlphaNumeric, false);
        });

        /* Email-Id */
        (ele).find(ClassName.email).bind("keyup keypress", function() {
            var ele = $(this);
            if (ele.val().length > 0)
                IsValidation(this, RegularExpression.Email, true);
            else
                ele.removeClass(ClassNameWithoutDot.validationError);
        });
    }

    function IsValidation(ele, regularExpression, highlightError) {
        var ele = $(ele);
        var value = ele.val();
        var reg = regularExpression;
        var status = !reg.test(value);
        if (status) {
            if (highlightError) {
                ele.addClass(ClassNameWithoutDot.validationError);
                ShowInformativeMessage(ele);
            }
            else
                ele.val(value.substring(0, value.length - 1));
        }
        else {
            if (highlightError) {
                ele.removeClass(ClassNameWithoutDot.validationError);
                HideInformativeMessage(ele);
            }
        }
        return status;
    }
    function format(source, params) {
        try {
            params = params.split(",");
            $.each(params, function(i, n) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
            });
            return source;
        }
        catch (ex) {
            alert(ex.message);
        }
    }

    function IsFoundError(ele) {
        return $(ele).find(ClassName.validationError).length == 0;
    }

   
    function ShowInformativeMessage(ele) {
        ele.addClass(ClassNameWithoutDot.validationError);
        var message = Messages.thisField;
        if (IsAttributeExist(ele, AttributeName.required)) {
            message = ele.attr(AttributeName.required);
        }
        ele.bt(format(Messages.required, "<b>" + message + "</b>"));
    }

    function HideInformativeMessage(ele) {
        ele.bt({ trigger: 'none' });
    }
    
    function IsAttributeExist(selector, finderAttributeName) {
        var hasAttribute = false;
        selector.each(function(index, element) {
            if (element.attributes.length > 0) {
                $(element.attributes).each(function() {
                    //debugger;
                    if ($(this)[0].name == finderAttributeName) {
                        hasAttribute = true;
                        return false; // breaks out of the each once we find an attribute
                    }
                });
                if (hasAttribute)
                    return false;
            }
        });
        return hasAttribute;
    }

})(jQuery)