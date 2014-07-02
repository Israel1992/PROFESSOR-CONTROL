
/*
sessionStorage.setItem('miClave','1');
sessionStorage.setItem();
sessionStorage.length;//devuelve 2
sessionStorage.clear(); //limpia
*/
window.onload = function() {
	
	var DB=new IndexDB();
	$("#load").hide();
	$( "#eliminar" ).bind( "click", function() {	
				DB.deletedb("gruposDB", 1);
	});	

	//------------------------------------------------------------------------------------------
	$( "#genera" ).bind( "click", function() {	
		var valor = $('#cantidad').val();
		var tipo = $("#next_registro").attr("reg");
		switch(tipo)
			{
			case 'gru':
			  sessionStorage.setItem('numGrupos',valor);
			  create_grupos(valor);
			  break;
			case 'alu':
				DB.mosOnlyGrupos("gruposDB", 1);
			    sessionStorage.setItem('numAlumnos',valor);
				setTimeout (function(){create_alumnos(valor)},3000);
			  break;	  
			}
	});	
//----------------------------------------------------------------------------------------------
	$( "#next_registro" ).bind( "click", function(event) {	
		
		var tipo = $("#next_registro").attr("reg");
		switch(tipo)
			{
			case 'gru':
			  var valor=sessionStorage.numGrupos;
			  if(sessionStorage.numGrupos<1){
					DB.add("gruposDB", 1);
					setTimeout (limpiar, 2000);
			  }else{
					sessionStorage.setItem('numGrupos',valor);
					DB.add("gruposDB", 1);
					setTimeout (create_grupos, 2000);	
			  }
			 break;
			  
			case 'alu':
			  var valor=sessionStorage.numAlumnos;
			   if(sessionStorage.numAlumnos<1){
					DB.add("gruposDB", 1);
					setTimeout (limpiar, 2000);
			  }else{
					sessionStorage.setItem('numGrupos',valor);
					DB.add("gruposDB", 1);
					setTimeout (create_alumnos, 2000);	
			  }
			  break;	  
			}
	});	
//---------------------------------------------------------------------------------------------
	$( "#mostrar" ).bind( "click", function() {	
		DB.mostrar("gruposDB", 1);	
	});	
	
//----------------------------------------------------------------------------------------------
	$( "#next_alumno" ).bind( "click", function() {	
		//$('#grupos_actuales').append("</table>");
		DB.mostrar("gruposDB", 1);	
	});		
//---------------------------------------------------------------------------------------------s
		function limpiar(){
			$( "#carga_registros" ).empty();
		}
//------------------------------------------------------------------------------------------------		
		function create_grupos(){
			
			var grupo="<br/><br/><br/><table align='center' style='color:white; width:300px'>" 
						+"<tr><td>Grupo</td><td><input id='grupo' placeholder='Grupo' autofocus	title='Tu nombre' required type='text' /></td></tr>"
						+"<tr><td>Materia</td><td><input id='materia' placeholder='Materia' autofocus	title='Tu nombre' required type='text'/></td></tr>"
						+"<tr><td>Hora</td><td><input id='horas' type='text' placeholder='11-12' autofocus	title='Tu nombre' required'/></td></tr>"
						+"<tr><td>Dias</td><td><input id='dias' type='text' placeholder='1-7' autofocus	title='Tu nombre' required' /></td></tr>" 
						+"<tr><td>Salon</td><td><input id='salon' type='text' placeholder='salon'	title='Tu nombre' required'/></td></tr>"
						+"<tr><td>Unidades</td><td><input id='unidades' type='text' placeholder='Unidades' autofocus	title='Tu nombre' required /></td></tr>"
						+"</table>"
						+"<p>Registros que faltan: "+sessionStorage.numGrupos+"</p>";

			$( '#carga_registros' ).html(grupo);		
		}
//------------------------------------------------------------------------------------------------		
		function create_alumnos(valor,array){
			var storedGrupos=JSON.parse(localStorage[0]);
			var count = Object.keys(storedGrupos).length;
			var alumnos="<div class='th'>  <div class='td'>NC</div>  <div class='td'><input id='nc' placeholder='NC' type='text'></input> </div></div>"
						+"<div class='th'>  <div class='td'>Nombre</div>  <div class='td'><input id='nombre' placeholder='Nombre' autofocus	title='Tu nombre' required type='text'/></div> </div>"
						+"<div class='th'>  <div class='td'>Apd paterno</div>  <div class='td'><input id='apd_paterno' placeholder='Apd paterno' autofocus required type='text'/></div>  </div>"
						+"<div class='th'>  <div class='td'>Apd materno</div>  <div class='td'><input id='apd_materno' placeholder='Apd materno' autofocus required type='text' /></div>  </div>" 
						+"<div class='th'>  <div class='td'>semestre</div>  <div class='td'><input id='semestre' placeholder='semestre' autofocus	title='Tu nombre' required type='text'/></div>  </div>" 
						+"<div class='th'>  <div class='td'>grupo</div>"
						+"<div class='td'> <select name='grupo' id='grupo' class='grupo'>";
						for(var i=0;i<count;i++){
							alumnos=alumnos+"<option>"+storedGrupos[i]+"</option>";
						}
						alumnos=alumnos+"</select></div></div>"
						+"<h2 style='font:18px arial;color:white' >Registros que faltan: "+sessionStorage.numAlumnos+"</h2>";
			$( '#carga_registros' ).html(alumnos);
			
		}
//------------------------------------------------------------------------------------------------		

		function validar_grupo(){
			var grupo = $('#grupo').val();
			var materia = $('#materia').val();
			var dias = $('#dias').val();
			var horas = $('#horas').val();			
		}
}
//-----------------------------------------------------------------------------------------------
		function openAlumGrup(id){
			sessionStorage.setItem('alumno_grupo',id);
			window.location='alumnos_grupos.html';
		}
//-----------------------------Efectos de la aplicacion----------------------------------------------		
			
		function alumList(){
			var DB=new IndexDB();
			DB.AlumGrup("gruposDB", 1);
		}
//------------------------------------------------------------------------------------------------
		function alumGrup(){
			var DB=new IndexDB();
			DB.AlumGrup("gruposDB", 1);
		}
	//-----------------------------Efectos de la aplicacion----------------------------------------------		
		function espera(){
			$("#load").show("slow");	
				
		}
		//----------------------------------
		function limpia(){
			$("#load").hide("slow");	
		}
		
//----------------------------------------------------------------------------------------------

	function mosOnlyGrupos(){
		var DB=new IndexDB();
			DB.mosOnlyGrupos("gruposDB", 1);
			var storedGrupos=JSON.parse(localStorage[0]);
			var count = Object.keys(storedGrupos).length;
			seleccion="<select id='grupos'>";
				for(var i=0;i<count;i++){
					seleccion=seleccion+"<option>"+storedGrupos[i]+"</option>";
				}
				seleccion=seleccion+"</select>";
			$('nav').append(seleccion);
	}
//-----------------------------------------------------------------------------------------------
	function mosList(){
		var DB=new IndexDB();
		var posicion=document.getElementById("grupos").options.selectedIndex; 
		var grupo = document.getElementById("grupos").options[posicion].text;
		sessionStorage.setItem('alumno_grupo',grupo);
		window.location='mostrar_lista.html';
	}	
//-------------------------------------------------------------------------------------------
	function almacenarLista(){
		var DB=new IndexDB();
		DB.addLista();
		/*for(var i;i){
			$('.td input').attr('checkbox', true);*/
			
	}
//-------------------------------------------------------------------------------------------
	function mostrar_grupos(){
		var DB=new IndexDB();
		DB.mostrar("gruposDB", 1);
	}
//-------------------------------------------------------------------------------------------
	function iniciar(){
		var DB=new IndexDB();
		DB.init("gruposDB", 1);
	}	


