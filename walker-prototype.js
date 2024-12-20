let walkers = [];

let Walker = function(v) {
    this.v = v;
    this.goalV = null;
    this.distanceToWalk = null;
    this.walking = false;
    this.speed = 0.01;
    walkers.push(this);
    this.extraVelocity = 0;
    this.sleeping = false;
    this.traverse = true;
};

Walker.prototype.teleport = function() {
    let newVertex;
    do {
        newVertex = random(g.vertices);
    } while (newVertex.edges.length < 1);
    this.v = newVertex;
    this.goalV = null;
    this.distanceToWalk = null;
    this.walking = false;
    this.speed = 0.0075;
    this.extraVelocity = 0;
};

Walker.prototype.startWalking = function() {
    if (this.traverse) {
        if (this.v.edges) {
            let oldest = Infinity;
            let chosen = null;
            let chosenEdge = null;
            for (let i = 0; i < this.v.edges.length; i++) {
                let other;
                if (this.v.edges[i].a == this.v) {
                    other = this.v.edges[i].b;
                } else {
                    other = this.v.edges[i].a;
                }
                if (other.lastVisited < oldest) {
                    oldest = other.lastVisited;
                    chosen = other;
                    chosenEdge = this.v.edges[i];
                }
            }
            if (chosen) {
                this.goalV = chosen;
                if (this.e) {
                    this.e.fire = 1;
                }
                this.e = chosenEdge;
            }
        }
    } else {
        if (this.v.edges) {
            let r = floor(random(this.v.edges.length));
            if (this.v.edges[r].a == this.v) {
                this.goalV = this.v.edges[r].b;
            } else {
                this.goalV = this.v.edges[r].a;
            }
        }
    }
    this.extraVelocity = 0.03;
    this.walking = true;
    this.walked = 0;
    this.distanceToWalk = dist(this.v.pos.x, this.v.pos.y, this.goalV.pos.x, this.goalV.pos.y);
};

Walker.prototype.walk = function() {
    this.walked += this.speed + this.extraVelocity;
    if (this.extraVelocity) {
        this.extraVelocity *= 0.9;
    }
    if (this.walked >= this.distanceToWalk) {
        this.walking = false;
        this.v = this.goalV;
        this.v.lastVisited = drawCount;
        this.goalV = null;
        // this.v.env.play();
        if (this.v.functions) {
            song.currentChord = this.v.functions;
        }
        this.sing();
    }
};

Walker.prototype.sing = function() {
    let osc = song.getFrequency(this.v.freq);
    socket.emit('note', osc);
};

Walker.prototype.sing = function() {
    // let osc = song.getFrequency(this.v.freq);
    socket.emit('note', this.extraVelocity);
};

Walker.prototype.sleep = function() {
    this.sleeping = true;
};

Walker.prototype.wake = function() {
    this.sleeping = false;
};

Walker.prototype.sw = function() {
    this.sleeping = !this.sleeping;
};

Walker.prototype.show = function() {
    if (!this.walking) {
        // fill(0);
        // ellipse(this.v.pos.x, this.v.pos.y, 20);
        if (!this.sleeping) {
            // vertices.push(this.v.pos.x, this.v.pos.y, cameraSpeed, 15);
            vertices.push(this.v.pos.x, this.v.pos.y, 0, 2);
            addCollision(this.v.pos.x, this.v.pos.y, this.extraVelocity);
        }
    } else {
        let d = map(this.walked, 0, this.distanceToWalk, 0, 1);
        let x = lerp(this.v.pos.x, this.goalV.pos.x, d);
        let y = lerp(this.v.pos.y, this.goalV.pos.y, d);
        // fill(0);
        // ellipse(x, y, 5);
        // vertices.push(x, y, cameraSpeed, 2);
        vertices.push(x, y, 0, 2);
    }
};