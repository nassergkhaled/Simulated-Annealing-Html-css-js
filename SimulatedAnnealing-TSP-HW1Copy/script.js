
var final_temperature = 1e-4;
var cr = 0.999999;
var CITIES = 0;
var current = [];
var best = [];
var best_cost = 0;
var detector=0
var initial_cost=0;
var last_cost=0;
var counter=0;
var x=0;
var circles = [],
      circle = {},
      overlapping = false,
      counter = 0;
var tsp_canvas = document.getElementById('canvas');
var tsp_ctx = tsp_canvas.getContext("2d");


function randomFloat(n)
{
	return (Math.random()*n);
}
function randomInt(n)
{
	return Math.floor(Math.random()*(n));
}
function randomInteger(a,b)
{
	return Math.floor(Math.random()*(b-a)+a);
}



function deep_copy(array, to)
{
	var i = array.length;
	while(i--)
	{
		to[i] = [array[i][0],array[i][1]];
	}
}

function getCost(route)
{
    
	var cost = 0;
	for(var i=0; i< CITIES-1;i++)
	{
		cost = cost + getDistance(route[i], route[i+1]);
	}
	cost = cost + getDistance(route[0],route[CITIES-1]);
	if(x==0){initial_cost=cost;document.getElementById('1').innerHTML=""+parseInt(cost);x=1;}
	counter++;
	return cost;
}

function getDistance(p1, p2)
{
	del_x = p1[0] - p2[0];
	del_y = p1[1] - p2[1];
	return Math.sqrt((del_x*del_x) + (del_y*del_y));
}

function randomreorder(route, i, j)
{
	//i=3
	//j=4

	//NEIGHBOR= 1,9,7,5,8,6,3
	var neighbor = [];
	deep_copy(route, neighbor);
	//N = CURRENT
	while(i != j)
	{
		var t = neighbor[j];
		neighbor[j] = neighbor[i];
		neighbor[i] = t;

		i = (i+1) % CITIES;
		if (i == j)
			break;
		j = (j-1+CITIES) % CITIES;
	}
	return neighbor;
}

function acceptanceProbability(current_cost, neighbor_cost)
{

	if(neighbor_cost < current_cost)
		return 1;
	return Math.exp((current_cost - neighbor_cost)/temperature);
}

function init()
{
	if(detector) {
		temperature = parseFloat($("#temperature").val());
		finaltemp = parseFloat($("#finalt").val());
		cr = parseFloat($("#coolrate").val());
		setInterval(solve, 10);//استدعي الفنكشن مع ديللاي 10
	}else {
		temperature = parseFloat($("#temperature").val());
		finaltemp = parseFloat($("#finalt").val());
		cr = parseFloat($("#coolrate").val());
		CITIES--;
		CITIES--;
		document.getElementById("cities").textContent=""+parseInt(CITIES);
		paint_lines();
		for(var j=1;j<CITIES+1;j++){
			var temp;
			current[j-1]=current[j];
		}
		setInterval(solve, 10);
	}
}

function solve() {


	if (temperature > final_temperature) {
		var current_cost = getCost(current);
		var k = randomInt(CITIES);//10
		var l = (k + 1 + randomInt(CITIES - 2)) % CITIES;


		if (k > l) {
			var tmp = k;
			k = l;
			l = tmp;
		}
		var neighbor = randomreorder(current, k, l);
		var neighbor_cost = getCost(neighbor);
		if (Math.random() < acceptanceProbability(current_cost, neighbor_cost)) {
			deep_copy(neighbor, current);
			current_cost = getCost(current);
		}
		if (current_cost < best_cost) {
			deep_copy(current, best);
			best_cost = current_cost;
			last_cost = getCost(best);
			paint();
		}
		temperature *= cr;//cooling rate




		document.getElementById('2').innerHTML = "" + parseInt(best_cost);
		last_cost = best_cost;
	}

		document.getElementById('3').innerHTML = "" + (parseInt(initial_cost) - parseInt(last_cost));
		setTimeout(function () {
			cbcolor()
		}, 1000000);

}

	



function RandomConnect(){
	x=0;
	CITIES = parseInt($("#cities").val());
	if (CITIES<2){
		alert("Number of cities cant be less than 2");
		}
	else {for(var i=0;i<CITIES;i++)
	{
		current[i] = [randomInteger(10,canvas.width-10),randomInteger(10,canvas.height-10)];
	}
	deep_copy(current, best);
	best_cost = getCost(best);
	paint();
}
	 
}

function paint()
{
	detector=1;
	tsp_ctx.clearRect(0,0, tsp_canvas.width, tsp_canvas.height);
	// Cities
	for(var i=0; i<CITIES; i++)
	{
		tsp_ctx.beginPath();
		tsp_ctx.arc(best[i][0], best[i][1], 12, 0, 2*Math.PI);
		tsp_ctx.fillStyle = "#ffffff";
		tsp_ctx.strokeStyle = "#000";
		tsp_ctx.closePath();
		tsp_ctx.fill();
		tsp_ctx.lineWidth=5;
		tsp_ctx.stroke();
	}
	tsp_ctx.strokeStyle = "#ff0000";
	tsp_ctx.lineWidth=2;
	tsp_ctx.moveTo(best[0][0], best[0][1]);
	for(var i=0; i<CITIES-1; i++)
	{
		tsp_ctx.lineTo(best[i+1][0], best[i+1][1]);
	}
	tsp_ctx.lineTo(best[0][0], best[0][1]);
	tsp_ctx.stroke();
	tsp_ctx.closePath();
}
function cbcolor (){
	x=0;
}
function paint_lines(){
	initial_cost=CITIES*744;
	document.getElementById('1').innerHTML=""+parseInt(initial_cost);
	document.getElementById('3').innerHTML=""+(parseInt(initial_cost)-parseInt(last_cost));
	CITIES++;
	tsp_ctx.strokeStyle = "#ff0000";
	tsp_ctx.lineWidth=2;
	tsp_ctx.moveTo(best[0][0], best[0][1]);
	for(var i=0; i<CITIES-1; i++)
	{
		tsp_ctx.lineTo(best[i+1][0], best[i+1][1]);
	}
	tsp_ctx.lineTo(best[0][0], best[0][1]);
	tsp_ctx.stroke();
	tsp_ctx.closePath();
}
