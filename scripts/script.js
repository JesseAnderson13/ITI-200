let node1 = document.getElementById('node1i');
let node2 = document.getElementById('node2i');
let node3 = document.getElementById('node3i');
let node4 = document.getElementById('node4i');
let node5 = document.getElementById('node5i');

node1.addEventListener("click", node1switch);
node2.addEventListener("click", node2switch);
node3.addEventListener("click", node3switch);
node4.addEventListener("click", node4switch);
node5.addEventListener("click", node5switch);

function node1switch(){
	if(node1.id === "node1i"){
		node1.id = "node1a";
	}
	else{
		node1.id = "node1i";
	}
}

function node2switch(){
	if(node2.id === "node2i"){
		node2.id = "node2a";
	}
	else{
		node2.id = "node2i";
	}
}

function node3switch(){
	if(node3.id === "node3i"){
		node3.id = "node3a";
	}
	else{
		node3.id = "node3i";
	}
}

function node4switch(){
	if(node4.id === "node4i"){
		node4.id = "node4a";
	}
	else{
		node4.id = "node4i";
	}
}

function node5switch(){
	if(node5.id === "node5i"){
		node5.id = "node5a";
	}
	else{
		node5.id = "node5i";
	}
}