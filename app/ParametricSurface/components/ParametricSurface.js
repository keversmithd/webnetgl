
import { ParameterizedEquation } from "./ParametricEquation";}

class ParameterizedSurface
{

    constructor( parameterizedEquation )
    {
        
    }


    generateQuadrature(projectionMethod:CoordinateProjectionScheme, scene)
    {
        var tpo = new vecn(this.uniqueDimensions);
        var tpe = new vecn(this.uniqueDimensions);
        var tpne = new vecn(this.uniqueDimensions);
        var tpn = new vecn(this.uniqueDimensions);


        let paramLength = this.parameterSpaces[0].y - this.parameterSpaces[0].x;
        let paramStep = paramLength / this.parameterSteps[0];


        //Divisible unit of parameter steps.
        let paramStepLength: number = this.parameterSteps[0];

        var anchor0: number = 0;
        var anchor1: number = 0;

        var vertexAttributes: Float32Array = new Float32Array((paramStepLength*paramStepLength*this.uniqueVariables) * 12);
        var elementAttributes: Uint16Array = new Uint16Array((paramStepLength * paramStepLength * this.uniqueVariables) * 6);
        var memoryDataBack: number = 0;
        var indexDataBack: number = 0;
        var index: number = 0;


        for (var j = 0; j < paramStepLength; j++)
        {
            let tj = (j*paramStep);
            let tj1 = ((j+1)*paramStep);

            let jterp = (1-tj)*this.parameterSpaces[0].x + (tj)*this.parameterSpaces[0].y;
            let jterp1 = (1-tj1)*this.parameterSpaces[0].x + (tj1)*this.parameterSpaces[0].y;
            let jvarname = this.variablesArray[0];
            

            for(var k = 0; k < paramStepLength-1; k++)
            {

                let tk = (k*paramStep);
                let tk1 = ((k+1)*paramStep);
    
                let kterp = (1-tk)*this.parameterSpaces[0].x + (tk)*this.parameterSpaces[0].y;
                let kterp1 = (1-tk1)*this.parameterSpaces[0].x + (tk1)*this.parameterSpaces[0].y;
                

                this.variableScope[jvarname] = jterp;

                
                for (var km = 0; km < this.uniqueDimensions; km++) 
                {
                    var mathNode = math.parse(this.equations[km]);
                    var tree = mathNode.compile();

                    for(var kset = 1; kset < this.variablesArray.length; kset++)
                    {
                        let kvarname = this.variablesArray[kset];
                        this.variableScope[kvarname] = kterp;
                    }

                    tpo.data[km] = tree.evaluate(this.variableScope);
                    tpo.data[km] = isNaN(tpo.data[km]) ? 0 : tpo.data[km];
                    
                    this.variableScope[jvarname] = jterp1;

                    tpe.data[km] = tree.evaluate(this.variableScope);
                    tpe.data[km] = isNaN(tpe.data[km]) ? 0 : tpe.data[km];

                    for(var kset = 1; kset < this.variablesArray.length; kset++)
                    {
                        let kvarname = this.variablesArray[kset];
                        this.variableScope[kvarname] = kterp1;
                    }

                    tpne.data[km] = tree.evaluate(this.variableScope);
                    tpne.data[km] = isNaN(tpne.data[km]) ? 0 : tpne.data[km];

                    this.variableScope[jvarname] = jterp;


                    tpn.data[km] = tree.evaluate(this.variableScope);
                    tpn.data[km] = isNaN(tpn.data[km]) ? 0 : tpn.data[km];


                }
                var projectedCoordinates: { p0: vec3, p1: vec3, p2: vec3, p3: vec3 } = projectionMethod({ c0: tpo, c1: tpe, c2: tpne, c3: tpn });

                vertexAttributes[memoryDataBack] = projectedCoordinates.p0.x;
                vertexAttributes[memoryDataBack+1] = projectedCoordinates.p0.y;
                vertexAttributes[memoryDataBack+2] = projectedCoordinates.p0.z;
                memoryDataBack+=3;
                vertexAttributes[memoryDataBack] = projectedCoordinates.p1.x;
                vertexAttributes[memoryDataBack+1] = projectedCoordinates.p1.y;
                vertexAttributes[memoryDataBack+2] = projectedCoordinates.p1.z;
                memoryDataBack+=3;
                vertexAttributes[memoryDataBack] = projectedCoordinates.p2.x;
                vertexAttributes[memoryDataBack+1] = projectedCoordinates.p2.y;
                vertexAttributes[memoryDataBack+2] = projectedCoordinates.p2.z;
                memoryDataBack+=3;

                vertexAttributes[memoryDataBack] = projectedCoordinates.p0.x;
                vertexAttributes[memoryDataBack+1] = projectedCoordinates.p0.y;
                vertexAttributes[memoryDataBack+2] = projectedCoordinates.p0.z;
                memoryDataBack+=3;
                vertexAttributes[memoryDataBack] = projectedCoordinates.p2.x;
                vertexAttributes[memoryDataBack+1] = projectedCoordinates.p2.y;
                vertexAttributes[memoryDataBack+2] = projectedCoordinates.p2.z;
                memoryDataBack+=3;
                vertexAttributes[memoryDataBack] = projectedCoordinates.p3.x;
                vertexAttributes[memoryDataBack+1] = projectedCoordinates.p3.y;
                vertexAttributes[memoryDataBack+2] = projectedCoordinates.p3.z;
                memoryDataBack+=3;

            }

        }



        //this.verifyVert(vertexAttributes);
        return this.setUpNonElement(vertexAttributes);
        
    }

}