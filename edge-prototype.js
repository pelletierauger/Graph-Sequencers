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

Edge.prototype.show = function() {
    // line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/5,
        ox, oy, 0, 0.0001
    );
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/45,
        ox, oy, 0, 0.1
    );
};

Edge.prototype.show = function() {
    // line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    let x = cameraSpeed;
    x = Math.pow(x, 5)*1.5;
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/5+Math.min(0.25,x*0.5),
        1, 0, 0, 0.001
    );
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/45,
        1, 0, 0, Math.min(0,0.1-x)
    );
};
