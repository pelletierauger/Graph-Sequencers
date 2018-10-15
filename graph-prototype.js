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
    let d = 60;
    for (let i = 0; i < this.vertices.length; i++) {
        let ranX = random(-1, 1);
        if (this.vertices[i].pos.x + ranX >= (width - height) * 0.5 + d) {
            if (this.vertices[i].pos.x + ranX <= (((width - height) * 0.5) + d + height - (d * 2) * 0.5) - d) {
                this.vertices[i].pos.x += random(-1, 1);
            }
        }
        let ranY = random(-1, 1);
        if (this.vertices[i].pos.y + ranY >= d && this.vertices[i].pos.y + ranY <= height - d) {
            this.vertices[i].pos.y += random(-1, 1);
        }
    }
};

Graph.prototype.createEdge = function(a, b) {
    let e = new Edge(a, b);
    a.addEdge(e);
    b.addEdge(e);
    this.edges.push(e);
};