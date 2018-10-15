let Walker = function(v) {
    this.v = v;
};

Walker.prototype.jump = function() {
    if (this.v.edges) {
        let r = floor(random(this.v.edges.length));
        if (this.v.edges[r].a == this.v) {
            this.v = this.v.edges[r].b;
        } else {
            this.v = this.v.edges[r].a;
        }
    }
};

Walker.prototype.show = function() {
    fill(0);
    ellipse(this.v.pos.x, this.v.pos.y, 15);
};