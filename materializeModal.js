(function(window){

	function materializeModal(){
		var _exports = {};

		var _structure = 
			'<div class="modal">' + 
			'<div class="modal-content"></div>' + 
			'<div class="modal-footer"></div>' + 
			'<div>';


		function getUniqueID(){
			var id = new String;
			var field = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for(var i = 0; i < 5; i++)
				id += field.charAt(Math.floor(Math.random() * field.length));

			return id;
		}

		function iterateObject(object){
			var obj = object.buttons;

			var array_key = new Array;

			Object.keys(obj).forEach(function(key,index){
				array_key[index] = key;
			});

			return array_key;
		}

		function generateButtons(options, array){
			var array_buttons = new String;

			$.each(array, function(index, key){
				var design = $(options.buttons[key].design);
				design.addClass(key);

				var button = design.prop('outerHTML');

				array_buttons += button;
			});

			return array_buttons;
		}

		function defineOptions(options, type){
			var unique_id = getUniqueID();
			var defaults = {
				title:'',
				body:'',
				value:'',
				buttons:{},
				footer:'<a class=" modal-action modal-close waves-effect waves-green btn-flat">OK</a>',
				id:unique_id
			};

			var modal_options;
			var options_type = typeof(options);

			if(options_type === 'string') modal_options = defaults;
			if(options_type === 'object') modal_options = $.extend({}, defaults, options);

			switch(type) {
				case 'alert':
					if(options_type === 'string') modal_options.body = options;
					modal_options.footer = '<a class=" modal-action modal-close waves-effect waves-green btn-flat">OK</a>';
					break;

				case 'confirm':
					if(options_type === 'string') modal_options.body = options;
					modal_options.footer = '<a class="modal-action modal-close waves-effect waves-green btn-flat ok">OK</a>' + 
											'<a class="modal-action modal-close waves-effect waves-red btn-flat cancel">Cancel</a>';
					break;

				case 'prompt':
					if(options_type === 'string') modal_options.title = options;
					modal_options.body = '<input class="modal-input" type="text">';
					modal_options.footer = '<a class="modal-action modal-close waves-effect waves-green btn-flat ok">OK</a>' + 
											'<a class="modal-action modal-close waves-effect waves-red btn-flat cancel">Cancel</a>';
					break;

				case 'custom':
					var array_key = iterateObject(modal_options);
					var footer_buttons = generateButtons(modal_options, array_key);
					modal_options.footer = footer_buttons;
					break;
			}

			return modal_options;
		}

		function optionsToModal(options){
			var title = options.title,
				body = options.body,
				footer = options.footer,
				id = options.id

			var structure = $(_structure);
			var content = new String;

			if(options.title === ''){
				content = body;
			} else {
				content = '<h4>' + title + '</h4>' + '<br><p>' + body + '</p>';
			}

			structure.attr('id', id);
			structure.find('.modal-content').html(content);
			structure.find('.modal-footer').html(footer);

			return $('body').append(structure);

		}

		_exports.alert = function(options) {
			var o = defineOptions(options, 'alert');
			var modal = optionsToModal(o);
			var element = '#' + o.id;

			return $(element).openModal();
		}

		_exports.confirm = function(options, callback) {
			var o = defineOptions(options, 'confirm');
			var modal = optionsToModal(o);
			var element = '#' + o.id;

			$(element).openModal();

			$(element + ' .modal-footer a.ok').click(function(){
				return callback(true);
			});

			$(element + ' .modal-footer a.cancel').click(function(){
				return callback(false);
			});
		}

		_exports.prompt = function(options, callback) {
			var o = defineOptions(options, 'prompt');
			var modal = optionsToModal(o);
			var element = '#' + o.id;

			$(element).openModal();

			$(element + ' .modal-content input.modal-input').attr('value', o.value);

			$(element + ' .modal-footer a.ok').click(function(){
				var input = $(element + ' .modal-content input.modal-input').val();
				return callback(input);
			});

			$(element + ' .modal-footer a.cancel').click(function(){
				return callback(null);
			});
		}

		_exports.custom = function(options) {
			var o = defineOptions(options, 'custom');
			var array_key = iterateObject(o);
			var modal = optionsToModal(o);
			var element = '#' + o.id;

			$(element).openModal();

			console.log(array_key)

			$.each(array_key, function(index, key){
				$(element + ' .modal-footer a.' + key).click(function(){
					o.buttons[key].callback();
				});
			});
		}

		return _exports;
	}

	if(typeof(window.materializeModal) === 'undefined'){
		window.materializeModal = materializeModal();
	}

})(window);