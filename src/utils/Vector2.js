export default class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    set(x, y){
        this.x = x;
        this.y = y;
    }

    add(vecOrX, y = null){
        if(y == null){
            this.x += vecOrX.x;
            this.y += vecOrY.y;
        } else {
            this.x += vecOrX;
            this.y += y;
        }
    }

    scale(k){
        this.x *= k;
        this.y *= k;
    }

    mag(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    distSq(other){
        return (this.x - other.x)*(this.x - other.x) + (this.y - other.y)*(this.y - other.y)
    }

    dist(other){
        return Math.sqrt(this.distSq(other));
    }
}