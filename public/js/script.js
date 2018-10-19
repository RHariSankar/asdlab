$(document).ready(function(){

	//=====================Genral=================================================
	// Search
	$("#search-text").on("keyup", function(){
		var value = $(this).val().toLowerCase();
		$("tbody tr").filter(function(){
		 	$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});
	});

	//datetime picker
  	$('#datepicker').datepicker({
  		dateFormat: 'dd/mm/yy'
  	});

		$('#delete-item').on('click', function(){
  		if(confirm('Do you want to delete this item?')){
  			$('#delete-form').submit();
  		}
  	});
	//============================================================================

	//============= item-master route ============================================
	// index view
	if($('tbody').is('#items')){
		$.ajax({
			datatype: 'JSON',
			type: 'GET',
			url: '/item-master',
			success: function(data){
				var rmc;
				var html = "";
				var size;
				for(i=1; i<=data.length; i++){
					rmc = "";
					size = "";
					for(j=0; j<data[i-1].rmc_data.length; j++){
						if(j===0){
							rmc += data[i-1].rmc_data[j].rmc_no + "("+data[i-1].rmc_data[j].qty+")";
						} else{
							rmc += ", " + data[i-1].rmc_data[j].rmc_no + "("+data[i-1].rmc_data[j].qty+")";
						}
					}
				  for(j=0; j<data[i-1].size.length; j++){
						if(j===0){
							size += data[i-1].size[j].value + data[i-1].size[j].unit + '(' +data[i-1].size[j].size_param + ')';
						} else{
							size += ' X '+ data[i-1].size[j].value + data[i-1].size[j].unit + '(' +data[i-1].size[j].size_param + ')';
						}
					}
					html += '<tr>\
					<td class="text-center align-middle p-0">'+i+'</td>\
					<td><a href="/item-master/'+ data[i-1]._id +'">'+data[i-1].card_no+'</a></td>\
					<td>'+data[i-1].location+'</td>\
					<td>'+data[i-1].material+'</td>\
					<td>'+data[i-1].alloy+'</td>\
					<td>'+data[i-1].form+'</td>\
					<td>'+size+'</td>\
					<td>'+data[i-1].qty.value + data[i-1].qty.unit+'</td>\
					<td>'+rmc+' <a href="/item-master/'+data[i-1]._id+'/rmc/new">Add</a></td>\
					</tr>';
				}
				$('#items').html(html);
			}
		});
	}

	//Item master new view
	function getItemData(){
		return $.ajax({
			datatype:'JSON',
			type:'GET',
			url: document.URL
		});
	}

	if(document.location.pathname === '/item-master/new' || $('form').is('#item-edit')){
		var promise = getItemData();
		promise.done(function(data){
			var materialHtml = '<option value="none">Select</option>';
			var formHtml = '<option value="none">Select</option>';
			data.materials.forEach(function(material){
				materialHtml += '<option value='+material.material_class+'>'+material.material_class+'</option>';
			});
			data.forms.forEach(function(form){
				formHtml += '<option value='+form.material_form+'>'+form.material_form+'</option>';
			});
			$('#select-material').html(materialHtml);
			$('#select-form').html(formHtml);
		});
	}

	$('#select-material').on('change', function(){
		var promise = getItemData();
		var alloys;
		var alloyHtml = '<option value ="none">Select</option>'
		if($('#select-material').val() != 'none'){
			promise.done(function(data){
				console.log(data);
				alloys = data.materials.find(function(material){
					return $('#select-material').val() === material.material_class;
				}).alloys;
				//console.log(alloys);
				alloys.forEach(function(alloy){
					alloyHtml += '<option value='+alloy+'>'+alloy+'</option>';
				});
				$('#select-alloy').html(alloyHtml);
			});
		} else{
			$('#select-alloy').html('');
		}

	});

	$('#select-form').on('change', function(){
		var size_params_Html = "";
		var promise = getItemData();
		var size_params;
		if($('#select-form').val() !== 'none'){
			promise.done(function(data){
				size_params = data.forms.find(function(form){
					return $('#select-form').val() === form.material_form;
				}).size_params;
				size_params.forEach(function(param){
					size_params_Html += '<div class="form-group col-md-4">\
															 <label class="col-sm-4 col-form-label">'+param+'<label>\
															 </div>\
															 <div class="form-group col-md-4">\
										 					 <input type="text" class="form-control" name="size_value">\
										 					 </div>\
															 <div class="form-group col-md-4">\
 															<input type="text" class="form-control" name="size_unit" placeholder="Unit">\
 															</div>';

				});
				$('#size').html(size_params_Html);
			});
			} else{
				$('#size').html('');
			}
	});

	$('#select-qty-unit').on('change', function(){
		$('#rol-unit').text($(this).val());
	});
//==============================================================================

//============= rmc route ======================================================
// New rmc view
	$('#new-rmc-form').submit(function(e){
		return false;
	});

	var rmc_counter = 0;
	if($('form').is('#new-rmc-form')){
			rmc_counter = 0;
			$('#remove-rmc').hide();
		}

	$('#add-rmc').on('click', function(){
				rmc_counter += 1;
				var html = '<div class="rmc">\
						<div class="form-row">\
							<div class="form-group col-md-2">\
								<label></label>\
								<label class="form-control-plaintext">RMC '+rmc_counter+'</label>\
							</div>\
							<div class="form-group col-md-3">\
								<label>RMC No.</label>\
								<input type="text" name="rmc_no" class="form-control">\
							</div>\
							<div class="form-group col-md-2">\
								<label>Qty</label>\
								<input type="number" class="rmc-qty form-control" name="qty" min=0>\
							</div>\
							<div class="form-group col-md-5">\
								<label>Remark</label>\
								<input type="text" class="form-control" name="remark">\
							</div>\
						</div>\
					</div>';
				$(this).before(html);
			if(rmc_counter > 0){
				$('#remove-rmc').show();
			}
		});

	$('#remove-rmc').on('click', function(){
			rmc_counter -= 1;
			$('.rmc:last-of-type').remove();
			if(rmc_counter ===0){
				$(this).hide();
			}
		});

	$('#rmc-form-submit').click(function(){
			var promise = getItemData();
			promise.done(function(data){
					var maxQty = Number(data.maxQty);
					console.log(maxQty);
					$('.rmc-qty').each(function(index){
							maxQty -= Number($(this).val());
						});
					if(maxQty < 0){
				alert('Error: RMC quantities exeeded card quantity. Please check rmc quantities.')
			} else{
					$('#new-rmc-form').unbind().submit();
					}
			});
		});
	//============================================================================

	//==========================Materials Route ==================================
	// Material Index view
	if($('tbody').is('#materials')){
		$.ajax({
			datatype: 'JSON',
			type: 'GET',
			url: '/materials',
			success: function(data){
				var alloys;
				var html = "";
				for(i=1; i<=data.length; i++){
					alloys = "";
					for(j=0; j<data[i-1].alloys.length; j++){
						if(j===0){
							alloys += data[i-1].alloys[j];
						} else{
							alloys += ", " + data[i-1].alloys[j];
						}
					}
					html += '<tr>\
					<td class="text-center align-middle p-0">'+i+'<a href="/materials/'+data[i-1]._id+'/edit"> edit</a></td>\
					<td>' +data[i-1].material_class+'</td>\
					<td>'+alloys+'</td>\
					</tr>';
				}
				$('#materials').html(html);
			}
		});
	}

	//New material view
	$('#new-material-form').submit(function(e){
		return false;
	});

	var alloy_counter = 0;
	if($('form').is('#new-material-form')){
			alloy_counter = 0;
			$('#remove-alloy').hide();
		}

	$('#add-alloy').on('click', function(){
				alloy_counter += 1;
				var html = '<div class="alloy">\
						<div class="row">\
						<div class="col-md-6">\
						<div class="form-inline">\
						<label>Alloy '+alloy_counter+'</label>\
						<input type="text" name="alloys" class="form-control m-2">\
						</div>\
						</div>\
						</div>\
						</div>';
				$(this).before(html);
			if(alloy_counter > 0){
				$('#remove-alloy').show();
			}
		});

	$('#remove-alloy').on('click', function(){
			alloy_counter -= 1;
			$('.alloy:last-of-type').remove();
			if(alloy_counter ===0){
				$(this).hide();
			}
		});

	$('#material-form-submit').click(function(){
			$('#new-material-form').unbind().submit();
		});

	//============================================================================

	//===============================Material form routes ========================
	//Materials form index view
	if($('tbody').is('#forms')){
		$.ajax({
			datatype: 'JSON',
			type: 'GET',
			url: '/material-forms',
			success: function(data){
				var size_params;
				var html = "";
				for(i=1; i<=data.length; i++){
					size_params = "";
					for(j=0; j<data[i-1].size_params.length; j++){
						if(j===0){
							size_params += data[i-1].size_params[j];
						} else{
							size_params += ", " + data[i-1].size_params[j];
						}
					}
					html += '<tr>\
					<td class="text-center align-middle p-0">'+i+'<a href="/materials/'+data[i-1]._id+'/edit"> edit</a></td>\
					<td>' +data[i-1].material_form+'</td>\
					<td>'+size_params+'</td>\
					</tr>';
				}
				$('#forms').html(html);
			}
		});
	}
	//New material form view
	$('#new-form-form').submit(function(e){
		return false;
	});

	var size_params_counter = 0;
	if($('form').is('#new-form-form')){
			size_params_counter = 0;
			$('#remove-param').hide();
		}

	$('#add-param').on('click', function(){
				size_params_counter += 1;
				var html = '<div class="params">\
						<div class="row">\
						<div class="col-md-6">\
						<div class="form-inline">\
						<label>Parameter '+size_params_counter+'</label>\
						<input type="text" name="size_params" class="form-control m-2">\
						</div>\
						</div>\
						</div>\
						</div>';
				$(this).before(html);
			if(size_params_counter > 0){
				$('#remove-param').show();
			}
		});

	$('#remove-param').on('click', function(){
			size_params_counter -= 1;
			$('.params:last-of-type').remove();
			if(size_params_counter ===0){
				$(this).hide();
			}
		});

	$('#form-form-submit').click(function(){
			$('#new-form-form').unbind().submit();
		});

	//============================================================================

	//=======================Issue Materials route ===============================
	//New issue material view
	// function getRmcData(card_no){
	// 	return $.ajax({
	// 		datatype:'JSON',
	// 		data: {card_no: card_no},
	// 		type:'GET',
	// 		url: document.URL
	// 	});
	// }

	$('#new-issue-form').submit(function(e){
		return false;
	});

	var item_counter = 0;
	var cardHtml = "";
	var items;
	if($('form').is('#new-issue-form') || $('form').is('#new-receipt-form')){
			item_counter = 0;
			$('#remove-item').hide();
			var promise = getItemData();
			promise.done(function(data){
				items = data;
				var cards = [];
				for(i=0; i<data.length; i++){
					cards.push({
						card_id: data[i]._id,
						card_no: data[i].card_no
					});
				}
				cards.forEach(function(card){
					cardHtml += '<option value='+card.card_id+'>'+card.card_no+'</option>'
				});
			});
		}

	$('#add-item').on('click', function(){
				item_counter += 1;
				var qty;
				if($('form').is('#new-issue-form')){
					qty = 'Issue Qty';
				} else if($('form').is('#new-receipt-form')){
					qty = 'Receipt Qty';
				}
				var html = '<div class="item">\
						<div class="form-row">\
							<div class="form-group col-md-1">\
								<label></label>\
								<label class="form-control-plaintext">Item '+item_counter+'</label>\
							</div>\
							<div class="form-group col-md-2">\
								<label>Card No.</label>\
								<select class="form-control card-no" name="card_id">\
									<option value="none">Select</option>\
									'+cardHtml+'\
								</select>\
							</div>\
							<div class="form-group col-md-4">\
								<label>RMC No.</label>\
								<select class="rmc-no form-control" name="rmc_id" disabled>\
								</select>\
								<button class="getrmc btn btn-primary my-1" disabled>Get RMCs</button>\
							</div>\
							<div class="form-group col-md-2">\
								<label>Availble Qty</label>\
								<label class="avl-qty form-control-plaintext"></label>\
							</div>\
							<div class="form-group col-md-2">\
								<label>'+qty+'</label>\
								<input type="number" class="req-qty form-control" name="qty" min=0>\
							</div>\
						</div>\
					</div>';
				$(this).before(html);
			if(item_counter > 0){
				$('#remove-item').show();
			}
		});

	function compareRmcNo($current){
		var flag = true;
		$('select.rmc-no').each(function(index){
			if(!$(this).is($current)){
				if($(this).val() === $current.val()){
					flag = false;
					return false;
				}
			}
		});
		return flag;
	}

	$(document).on('change', 'select.card-no', function(){
			  var	$current = $(this);
				var index = $('.card-no').index($current);
				$($('select.rmc-no')[index]).attr('disabled', true);
				if($current.val() == 'none'){
					$($('button.getrmc')[index]).attr('disabled', true);
				} else{
					$($('button.getrmc')[index]).removeAttr('disabled');
					$($('select.rmc-no')[index]).html("");
				}
		});

	$(document).on('click', 'button.getrmc', function(){
		var $current = $(this);
		var index = $('button.getrmc').index($current);
		var card_id = $($('select.card-no')[index]).val();
		var item = items.find(function(item){
			return item._id == card_id;
		});
		var rmcHtml = '<option value="none">Select</option>';
		item.rmc_data.forEach(function(rmc){
				rmcHtml += '<option value='+rmc._id+'>'+rmc.rmc_no+'</option>';
		});
			$($('select.rmc-no')[index]).html(rmcHtml);
			$($('select.rmc-no')[index]).attr('disabled', false);
	});

	$(document).on('change', 'select.rmc-no', function(){
		var $current = $(this);
		var index = $('select.rmc-no').index($current);
		var card_id = $($('select.card-no')[index]).val();
		if($current.val() != 'none'){
			if(compareRmcNo($current)){
				var item = items.find(function(item){
					return item._id == card_id;
				});
				var rmc = item.rmc_data.find(function(rmc){
					return rmc._id == $current.val();
				});
				//console.log(rmc);
				$($('label.avl-qty')[index]).text(rmc.qty + item.qty.unit);
				if($('form').is('#new-issue-form')){
					$($('.req-qty')[index]).attr('max', rmc.qty);
				}

			} else{
				alert('RMC no. already selected. Please select other RMC no.');
				$current.val('none');
			}
		}
	});

	$('#remove-item').on('click', function(){
			item_counter -= 1;
			$('.item:last-of-type').remove();
			if(item_counter ===0){
				$(this).hide();
			}
		});

	$('#issue-form-submit').click(function(){
			$('#new-issue-form').unbind().submit();
		});
//==============================================================================

//=======================Receive Materials route ===============================
$('#new-receipt-form').submit(function(e){
	return false;
});

$('#receipt-form-submit').click(function(){
		$('#new-receipt-form').unbind().submit();
	});
//==============================================================================

});
