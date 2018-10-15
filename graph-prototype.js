let Graph = function() {
    this.vertices = [];
    this.edges = [];
};

Graph.prototype.show = function() {
    for (let i = 0; i < this.edges.length; i++) {
        this.edges[i].show();
    }
    for (let i = 0; i < this.vertices.length; i++) {
        this.vertices[i].show();
    }
};

Graph.prototype.move = function() {
    for (let i = 0; i < this.vertices.length; i++) {
        this.vertices[i].pos.x += random(-1, 1);
        this.vertices[i].pos.y += random(-1, 1);
    }
};

Graph.prototype.createEdge = function(a, b) {
    let e = new Edge(a, b);
    a.addEdge(e);
    b.addEdge(e);
    this.edges.push(e);
};