
class ParameterizedEquation{

    constructor( equation )
    {

        //Use for method 1 of mesh generation.
        this.equations = [];
        this.variables = new Map();

        this.variableScope = new Map();
        this.variablesArray = [];
        this.uniqueVariables = 0;

        this.externalDelimiter = equation.charCodeAt(0);
        this.equation=equation;

        this.acceptedDelimiters=[
            44,45,39
        ];

        this.acceptedOperators=[40,41,42,43,45, 47];

        this.decodeEquation();
    }

    decodeEquation()
    {
        const equationLength = this.equation.length;
        var  currentCharacter = 0;
        var delimiterFound = false;
        var currentEquation = 0; //never used
        var equationString = ""
        
        this.uniqueDimensions = 1;
        var nextCharacter;

        for (var i = 1; i < equationLength; i++)
        {
            
            currentCharacter = this.equation.charCodeAt(i);


            if(currentCharacter === this.externalDelimiter)
            {
                continue;
            }


            var acceptedOperator = false;

            
            for(var k = 0; k < this.acceptedOperators.length; k++)
            {

                if(currentCharacter === this.acceptedOperators[k])
                {
                    acceptedOperator = true;
                    k = this.acceptedOperators.length;
                    
                }

            }

            if(i < equationLength-1)
            {
                nextCharacter = this.equation.charCodeAt(i+1);
            }

            let nextCharacterCriterium = (nextCharacter <= 90 && nextCharacter >= 65) || ((nextCharacter <= 122 && nextCharacter >= 97)) || (nextCharacter >= 48 && nextCharacter <= 57) || nextCharacter == 46 || acceptedOperator == true || nextCharacter == 40 || nextCharacter == 41;

            if ((currentCharacter <= 90 && currentCharacter >= 65) || ((currentCharacter <= 122 && currentCharacter >= 97)) || (currentCharacter >= 48 && currentCharacter <= 57) || currentCharacter == 46 || acceptedOperator == true)
            {
                
                

                if(acceptedOperator != true && !(currentCharacter >= 48 && currentCharacter <= 57)) //Is not a number
                {   


                    // p = currentCharacter >= 48 && q = currentCharacter <=57
                    // currentCharacter < 48 || currentCharacter > 57
                    //If an operand, that is a non number.
                    if (!this.variables.has(String.fromCharCode(currentCharacter)) && !nextCharacterCriterium)
                    {
                        
                        this.variables.set(String.fromCharCode(currentCharacter), 0);
                        this.variableScope[String.fromCharCode(currentCharacter)] = 0;
                        this.variablesArray.push(String.fromCharCode(currentCharacter));

                        // for(var x = 0; x < this.variableScopes.length; x++)
                        // {

                        //     this.variableScopes[x][String.fromCharCode(currentCharacter)] = 0;

                        // }

                        this.uniqueVariables+=1;
                        

                    }
                    

                }

                equationString += String.fromCharCode(currentCharacter);


            }


            
            

            if(delimiterFound == false)
            {
                for (var j = 0; j < this.acceptedDelimiters.length; j++) 
                {
                    if (currentCharacter == this.acceptedDelimiters[j]) {
                        delimiterFound = true;
                        this.delimiter = currentCharacter;
                        j = this.acceptedDelimiters.length;
                        this.equations.push(equationString);
                        this.uniqueDimensions++;
                        
                        equationString = "";
                    }
                }
            }else if(currentCharacter == this.delimiter)
            {
                this.equations.push(equationString);
                equationString = "";
                this.uniqueDimensions++;
                
            }else
            {

                //invalid character ignore.

            }
        }

        this.equations.push(equationString);
        equationString = "";
    }

    exportElements()
    {

        const equationElements = [];
        equationElements.push(<span>&#x5b;</span>);
        for(let i = 0; i < this.equations.length; i++)
        {
            equationElements.push(<span key={i}>{this.equations[i]}</span>);
            equationElements.push(<span>,</span>)
        }
        equationElements.push(<span>&#x5d;</span>);
        const variableElements = [];
        for(let i = 0; i < this.variablesArray.length; i++)
        {
            variableElements.push(<span key={i}>{this.variablesArray[i]}</span>);
            variableElements.push(<span>,</span>);
        }

        return {equations:equationElements,variables:variableElements,neq:this.uniqueVariables,nd:this.uniqueDimensions};
    }

}

export {ParameterizedEquation};
