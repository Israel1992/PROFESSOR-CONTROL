PROFESSOR-CONTROL
=================

Control de horario y grupos de alumnos, base de datos del lado del cliente con indexeddb.

Este es el codigo principal y la logica del almacenamiento relacional:


var IndexDB = function() {
    
    var db = null,
        name = null,
        version = null;
    var grup = new Array();

        init = function(dbname, dbversion) {
            name = dbname;
            version = dbversion;
			if (compatibility()) {
				var request = window.indexedDB.open("gruposDB", version);
					request.onupgradeneeded = function(event) {
						alert("Comenzando aplicacion para su uso");
						db = event.target.result;
						limpia();
						   if (db.objectStoreNames.contains("gruposDB")) {
								db.deleteObjectStore("gruposDB");
							}
							 //alert(db);
							var objectStoreGrupo = db.createObjectStore("grupos", { keyPath: "ssn" , autoIncrement:true });
							var objectStoreAlumnos = db.createObjectStore("alumnos", { keyPath: "ssn" , autoIncrement:true });						
							var objectStoreEvaluacion = db.createObjectStore("evaluacion", { keyPath: "ssn" , autoIncrement:true });	
							 objectStoreGrupo.createIndex("grupos", "grupos", { unique: true });
							 objectStoreAlumnos.createIndex("alumnos", "nc", { unique: true });
							 objectStoreAlumnos.createIndex("grupo", "grupo", { unique: false });
							 objectStoreEvaluacion.createIndex("alumnos", "alumnos", { unique: false });
							 objectStoreEvaluacion.createIndex("grupo", "grupo", { unique: false });
					}
				};
				request.onsuccess = function(event) {

					 db = event.target.result;

				};
				request.onerror = function(event) {
					alert("Database error: " + event);
				};
        },

    queryGrupos=function(){ 
					trans = db.transaction(["grupos"], "readonly"),
					store = trans.objectStore("grupos");
					var keyRange = IDBKeyRange.lowerBound(0);
					var cursorRequest = store.openCursor(keyRange);
					var i=0;
					
					cursorRequest.onsuccess = function(event) {
						var result = event.target.result;
						if (result === false || result === null){
							localStorage[0]=JSON.stringify(grup);
							limpia();
							return;
						};
						if(result){
							grup[i++]=result.value.grupo;
							result.continue ();		
						}else{
							alert("No ahy grupos disponibles");
							limpia();
							return;
						}

					};		
		}

		mosOnlyGrupos=function(dbname, dbversion){
			init(dbname, dbversion);
			espera();
			setTimeout (queryGrupos, 2000);
		}

       addAlumnos= function(){
			
				var trans = db.transaction(["alumnos"], "readwrite"),
					store = trans.objectStore("alumnos"),
					nc = document.getElementById("nc").value,
					nombre = document.getElementById("nombre").value,
					apd_paterno = document.getElementById("apd_paterno").value,
					apd_materno = document.getElementById("apd_materno").value;
					semestre = document.getElementById("semestre").value;
					var posicion=document.getElementById("grupo").options.selectedIndex; 
					var grupo = document.getElementById("grupo").options[posicion].text;
					
			const data = {nc: nc, 
						nombre: nombre, 
						apd_paterno: apd_paterno, 
						apd_materno: apd_materno,
						semestre: semestre,
						grupo:grupo};
						
            var request = store.add(data);
            
			trans.oncomplete= function(){
				limpia();
				alert("se almacenaron los datos con exito");
			};

		}
        

        addGrupos= function(){
			
				var trans = db.transaction(["grupos"], "readwrite"),
					store = trans.objectStore("grupos"),
					grupo = document.getElementById("grupo").value,
					materia = document.getElementById("materia").value,
					horas = document.getElementById("horas").value,
					dias = document.getElementById("dias").value;
					salon = document.getElementById("salon").value;
					unidades = document.getElementById("unidades").value;
					
			const data = {grupo: grupo, 
						materia: materia, 
						horas: horas, 
						dias: dias,
						salon: salon,
						unidades: unidades};
						
            var request = store.add(data);
            
			trans.oncomplete= function(){
				limpia();
				alert("se almacenaron los datos con exito");
			};

		}
        

        add = function(dbname, dbversion) {
           init(dbname, dbversion);  
           var tipo = $("#next_registro").attr("reg");
			switch(tipo)
			{
			case 'gru':
			espera();
			  setTimeout (addGrupos, 2000); 
			  break;
			case 'alu':
			espera();
			  setTimeout (addAlumnos, 2000); 
			  break;	  
			}
          
            
        },

       mostrar = function(dbname, dbversion) {
            init(dbname, dbversion);
            var tipo = $("#grupos_actuales").attr("reg");
			switch(tipo)
			{
			case 'gru':
				espera();
			  setTimeout (function(){
				  
			 var list = document.getElementById("grupos_actuales"),
					trans = db.transaction(["grupos"], "readonly"),
					store = trans.objectStore("grupos");
					list.innerHTML = "";
					var header="<div class='th'>"+
							"<div class='td'>clave</div><div class='td'>grupo</div><div class='td'>materia</div><div class='td'>horas</div><div class='td'>dias</div><div class='td'>salon</div ><div class='td'>unidades</div><div class='td'>Ver Alumnos</div>"+
							"</div>";
					$('#grupos_actuales').append(header);
					var keyRange = IDBKeyRange.lowerBound(0);
					var cursorRequest = store.openCursor(keyRange);
					
					cursorRequest.onsuccess = function(event) {
						var result = event.target.result;
						if (result === false || result === null){
						
							$('#grupos_actuales').prepend("</div>");
							limpia();
							return; 
							
						}
						if(result){
						key = result.key;
						 grupo = result.value.grupo;
						 materia = result.value.materia;
						 horas = result.value.horas;
						 dias = result.value.dias;
						 salon = result.value.salon;
						 unidades = result.value.unidades;
						 
						 contenido="<div class='tb'>"+
						 "<div class='td'>"+key+"</div>"
						 +"<div class='td'>"+grupo+"</div>"
						 +"<div class='td'>"+materia+"</div>"
						 +"<div class='td'>"+horas+"</div>"
						 +"<div class='td'>"+dias+"</div>"
						 +"<div class='td'>"+salon+"</div>"
						 +"<div class='td'>"+unidades+"</div>"
						 +"<div class='td' id="+grupo+" onClick='openAlumGrup(this.id)'>Alumnos</div>";

						$('#grupos_actuales').append(contenido);
						
						 result.continue ();
						}else{
							alert("No ahy datos disponibles");
							limpia();
							return;
						}
						 
						 
					};				  
				  }, 2000); 
			  break;
			case 'alu':
			espera();
			  setTimeout (function(){
			 var list = document.getElementById("grupos_actuales"),
					trans = db.transaction(["alumnos"], "readonly"),
					store = trans.objectStore("alumnos");
					list.innerHTML = "";
					var header="<div class='th'>"+
							"<div class='td'>clave</div><div class='td'>nc</div><div class='td'>nombre</div><div class='td'>apd paterno</div><div class='td'>apd materno</div><div class='td'>semestre</div ><div class='td'>grupo</div>"+
							"</div>";
					$('#grupos_actuales').append(header);
					var keyRange = IDBKeyRange.lowerBound(0);
					var cursorRequest = store.openCursor(keyRange);
					
					cursorRequest.onsuccess = function(event) {
						var result = event.target.result;
						if (result === false || result === null){
							$('#grupos_actuales').prepend("</div>");
							limpia();
							return;
						}
						if(result){
						key = result.key;
						nc = result.value.nc;
						 nombre = result.value.nombre;
						 apd_paterno = result.value.apd_paterno;
						 apd_materno = result.value.apd_materno;
						 semestre = result.value.semestre;
						 grupo = result.value.grupo;
						 
						
						contenido="<div class='tb'>"+
						 "<div class='td'>"+key+"</div>"
						 +"<div class='td'>"+nc+"</div>"
						 +"<div class='td'>"+nombre+"</div>"
						 +"<div class='td'>"+apd_paterno+"</div>"
						 +"<div class='td'>"+apd_materno+"</div>"
						 +"<div class='td'>"+semestre+"</div>"
						 +"<div class='td'>"+grupo+"</div>"
						 +"</div>";

						$('#grupos_actuales').append(contenido);
						 result.continue ();
						}else{
							alert("No ahy datos disponibles");
							limpia();
							return;
						}
					}
				}, 2000); 
			  break;	  
			}	
        },   

        del = function(timeStamp) {

            var transaction = db.transaction(["grupos"], "readwrite");
            var store = transaction.objectStore("grupos");

            var request = store.delete(timeStamp);

            request.onsuccess = function(event) {
					
					
            };

            request.onerror = function(event) {
                trace("Error deleting: " + e);
            };
        },

        AlumGrup= function(){
			
			init("gruposDB", 1);
			espera();
			setTimeout (function(){

				var header="<div class='th'>"+
						"<div class='td'>nc</div><div class='td'>nombre</div><div class='td'>apd paterno</div><div class='td'>apd materno</div><div class='td'>semestre</div>"+
						"</div>";
				var list = document.getElementById("grupos_actuales");
				var objectStore = db.transaction("alumnos").objectStore("alumnos");
				var index =objectStore.index("grupo");		
				var singleKeyRange = IDBKeyRange.only(sessionStorage.alumno_grupo);
				list.innerHTML = "";
				$('#grupos_actuales').append(header);
				index.openCursor(singleKeyRange).onsuccess = function(event) {
				  var cursor = event.target.result;
						if (cursor === false || cursor === null){
							$('#grupos_actuales').prepend("</div>");
							limpia();
							return; 
							
				}  
				  
				  if (cursor) {
					nc = cursor.value.nc;
					nombre = cursor.value.nombre;
					apd_paterno = cursor.value.apd_paterno;
					apd_materno = cursor.value.apd_paterno;
					semestre = cursor.value.semestre;
					 
					contenido="<div class='tb'>"+
					"<div class='td'>"+nc+"</div>"
					+"<div class='td'>"+nombre+"</div>"
					+"<div class='td'>"+apd_paterno+"</div>"
					+"<div class='td'>"+apd_materno+"</div>"
					+"<div class='td'>"+semestre+"</div>";
					$('#grupos_actuales').append(contenido);
					cursor.continue();
				  }
				 };					 
			}, 2000); 
			
		
		}, 

        deletedb = function(dbname) {

            var request = window.indexedDB.deleteDatabase(dbname);

            request.onsuccess = function() {
                alert("Database " + dbname + " deleted!");
            };

            request.onerror = function(event) {
               alert("deletedb(); error: " + event);
            };
        },
        
        constList = function(){
			init("gruposDB", 1);
			espera();
			setTimeout (function(){
				
				var header="<div class='th'>"+
						"<div class='td'>nc</div><div class='td'>nombre</div><div class='td'>apd paterno</div><div class='td'>apd materno</div><div class='td'>esta?</div><div class='td'>num</div>"+
						"</div>";
				var list = document.getElementById("grupos_actuales");
				var objectStore = db.transaction("alumnos").objectStore("alumnos");
				var index =objectStore.index("grupo");		
				
				var singleKeyRange = IDBKeyRange.only(sessionStorage.alumno_grupo);
				list.innerHTML = "";
				$('#grupos_actuales').append(header);

				index.openCursor(singleKeyRange).onsuccess = function(event) {
				  var cursor = event.target.result;
						if (cursor === false || cursor === null){
							$('#grupos_actuales').prepend("</div>");
							limpia();
							return; 
							
				}  
				  
				  if (cursor) {
					id = cursor.key;
					ssn = cursor.value.ssn;
					nc = cursor.value.nc;
					nombre = cursor.value.nombre;
					apd_paterno = cursor.value.apd_paterno;
					apd_materno = cursor.value.apd_paterno;
					 
					contenido="<div class='tb'>"+
					"<div class='td'>"+nc+"</div>"
					+"<div class='td'>"+nombre+"</div>"
					+"<div class='td'>"+apd_paterno+"</div>"
					+"<div class='td'>"+apd_materno+"</div>"
					+"<div class='td'><input type='checkbox' value='"+ssn+"' name='orderBox[]' checked></div>";
					$('#grupos_actuales').append(contenido);
					cursor.continue();
				  }
				 };					 
			}, 2000); 			
		},

        compatibility = function() {

            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || window.OIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

            if (window.indexedDB) {
                var span = document.querySelector("#compatibilidad");
                span.textContent = "Yes";
                span.style.color = "green";
                return true;
            }

            trace("Your browser does not support a stable version of IndexedDB.");
            return false;

        },


        addLista = function(ssnA) {
			init("gruposDB", 1);
			espera();
			//sessionStorage.setItem('EVATRUE',1);
			var KEYA = new Array() 
			var i=0;
			$('input[name="orderBox[]"]:checked').each(function() {	
					KEYA[i++]=$(this).val();
			});	
			
           setTimeout (function(){
					trans = db.transaction(["alumnos"], "readonly"),
					store = trans.objectStore("alumnos");
					var keyRange = IDBKeyRange.lowerBound(0);
					var cursorRequest = store.openCursor(keyRange);
					
					cursorRequest.onsuccess = function(event) {
						var result2 = event.target.result;
						result2.key;
						
						if (result2 === false || result2 === null){
							return;
						}else{
							var sssA=result2.key;
							for(var i=0;i<KEYA.length;i++){
								if(sssA=KEYA[i]){
									sessionStorage.setItem('KEYALUM',sssA);
									sessionStorage.setItem('KEYGRUP',result2.value.grupo);
									
									 if(sessionStorage.EVATRUE==2){
										 getAsist();					 
									 }else{
										 var trans = db.transaction(["evaluacion"], "readwrite"),
										 store = trans.objectStore("evaluacion"); 
										 var eva ={alumnos: sessionStorage.KEYALUM, 
												grupo: sessionStorage.KEYGRUP, 
												faltas: 0};
												
										var respuesta = store.add(eva);
											trans.oncomplete= function(){
												sessionStorage.setItem('EVATRUE',2);
												limpia();
												return;
											};	
											limpia();
											return;
									}
							     }	
							}
						}				 
				}
			}, 4000); 
        },

		getAsist = function(){
			 
			var objectStore = db.transaction("evaluacion").objectStore("evaluacion");
			var index =objectStore.index("alumnos");		
				
				var singleKeyRange = IDBKeyRange.only(sessionStorage.KEYALUM);

				index.openCursor(singleKeyRange).onsuccess = function(event) {
				  var cursor = event.target.result;
							if (cursor === false || cursor === null){
								return; 
							};
							
							mosEvaluacion();		
							setTimeout (function(){
								sessionStorage.setItem('FALTAS',cursor.value.faltas);						
								cursor.continue();
							},4000);
				};
			
	},

	setAsist = function(){
		var request = db.transaction(["evaluacion"], "readwrite")
                .objectStore("evaluacion")
                .delete("444-44-4444");
			request.onsuccess = function(event) {
			  // It's gone!
			};	
	},

	mosEvaluacion = function(){
	
			transa = db.transaction(["evaluacion"], "readonly"),
					almacenamiento = transa.objectStore("evaluacion");
					
					var keyRange = IDBKeyRange.lowerBound(0);
					var cursorRequest = almacenamiento.openCursor(keyRange);
					
					cursorRequest.onsuccess = function(event) {
						var resultados = event.target.result;
						if (resultados === false || resultados === null){
							limpia();
							return; 
						}else{
							if(resultados.value.grupo==sessionStorage.KEYGRUP&&resultados.value.alumnos==sessionStorage.KEYALUM){
								sessionStorage.setItem('KEYEVAL',resultados.key);
							}	
							resultados.continue ();
						} 
					};				  							
	};

	return {
			init: init,
			add: add,
			mostrar: mostrar,
			deletedb:deletedb,
			mosOnlyGrupos:mosOnlyGrupos,
			AlumGrup:AlumGrup,
			constList:constList,
			addLista:addLista
	};
}


