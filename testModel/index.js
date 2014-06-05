require(['model/var/models'],function(m){
	
	m.add('tt',{
		url:'1.txt',
		debug:'1.txt',
		data:{},
		datatype:'json',
		type:'get',
		onSend:function(xhr){},
		conver:{
			PID:{name:'Name',node:function(node,data){return node+'999999';}},
			Name:'PID',
			Company:{
				conver:{
					CID:'id',
				}
			}
		},
		default:{
			Counter:{
				CounterNote:0,
				CounterPlan:2,
			},
			WorkExp:{},
		}
	});
	
	m['tt'].fetch(function(xhr){
		console.log(xhr);
	},function(data){
		console.log(m['tt']);
	},function(e){
		console.log(e);
	});
	
});

