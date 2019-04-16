class Vertex{
	constructor(value){
		this.value = value;
		this.adjacent = new Map();
	}
}

class WeightedGraph{
	constructor(){
		this.vertices_map = new Map();
		this.size = 0;
	}

	addVertex(value){
		this.size+=1;
		let vertex_to_add = new Vertex(value);
		this.vertices_map.set(value, vertex_to_add);
		return vertex_to_add;
	}

	getVertex(value){
		if (this.vertices_map.has(value)){
			return this.vertices_map.get(value);
		}
		return 
	}

	addEdge(a, b, weight){
		if (!this.vertices_map.has(a)){
			this.addVertex(a);
		}
		if (!this.vertices_map.has(b)){
			this.addVertex(b);
		}
		this.vertices_map.get(a).adjacent.set(b, weight);
		this.vertices_map.get(b).adjacent.set(a, weight);
	}

	getAllVertices(){
		let result_list = []
		this.vertices_map.forEach((value, key, map)=>{
			result_list.push(key);
		})
		return result_list;
	}
}

module.exports.WeightedGraph = WeightedGraph;