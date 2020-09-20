module.exports = {
    convertToTrees: (array, idFieldName, parentIdFieldName, childrenIdFieldName) => {
        const cloned = array.slice();
      
        for (let i=cloned.length-1; i>-1; i--) {
            const parentId = cloned[i][parentIdFieldName];
        
            if (parentId) {
                const filtered = array.filter( (elem) => elem[idFieldName].toString() == parentId.toString() );
        
                if (filtered.length > 0) {
                    const parent = filtered[0];
            
                    if (parent[childrenIdFieldName] ){
                        parent[childrenIdFieldName].push(cloned[i]);
                    } else {
                        parent[childrenIdFieldName] = [cloned[i]];
                    }
            
                }
                cloned.splice(i,1);
            }
        }
      
        return cloned;
      }
}