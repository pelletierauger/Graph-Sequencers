let Edge = function(a, b) {
    this.a = a;
    this.b = b;
};

Edge.prototype.show = function() {
    // line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/5,
        1, 0, 0, 0.0001
    );
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/45,
        1, 0, 0, 0.1
    );
};