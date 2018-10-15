let Edge = function(a, b) {
    this.a = a;
    this.b = b;
};

Edge.prototype.show = function() {
    line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
};