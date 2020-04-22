import * as d3 from 'd3'

export const DASHBOARD_DROPDOWN={
    MAJORITY_PARTY: "majority",
}
export const EXCEL_COLUMNS = {
    PARTY:"PARTY",
    WINNER: "WINNER",
    STATE: "STATE",
    NAME: "NAME",
    GENDER: "GENDER",
    CATEGORY: "CATEGORY",
    AGE: "AGE",
    EDUCATION: "EDUCATION",
    CONSTITUENCY: "CONSTITUENCY",
    VOTES: "TOTAL VOTES",
    TOTAL_ELECTORS: "TOTAL ELECTORS",
    POLLED_VOTES_PERC: "OVER TOTAL VOTES POLLED IN CONSTITUENCY"   
}
export const STATE_MAP_INCONSISTENT={
    "Andaman & Nicobar Island": "Andaman & Nicobar Islands",
    "Arunanchal Pradesh": "Arunachal Pradesh",
    "NCT of Delhi": "NCT OF Delhi",
    "Dadara & Nagar Havelli": "Dadra & Nagar Haveli"
}

export const getStateName = (name) => {
    if(STATE_MAP_INCONSISTENT.hasOwnProperty(name)) {
        return STATE_MAP_INCONSISTENT[name]
    }
    return name
}

export const getColorLegend= (valueSet) => {
    let legend={}
    const valueArr = Array.from(valueSet)
    for(let i=0;i<valueArr.length;i++){
        legend[valueArr[i]]=d3.interpolatePlasma(i/valueArr.length)
    }
    
    return legend
}
export const getWinnerData = (data) => {
    return data.filter(row => row[EXCEL_COLUMNS.WINNER] === "1")
}

export const getPartyLegend = (data) => {
    let parties= new Set()
    data.forEach(row => {
        parties.add(row[EXCEL_COLUMNS.PARTY])        
    });
    let colorlegend= getColorLegend(parties)
    
    return colorlegend
}


export const getStateLegend = (data) => {
    let states = getStates(data)
    
    let colorlegend= getColorLegend(states)
    
    return colorlegend
}
export const processElectionDataMajorityParty = (data) => {
    
    let winnerData = getWinnerData(data)
    let MajorityState={}
    
    for(let i=0;i<winnerData.length;i++) {
        let party = winnerData[i][EXCEL_COLUMNS.PARTY], state = winnerData[i][EXCEL_COLUMNS.STATE]
        
        if(!MajorityState.hasOwnProperty(state)) {
            MajorityState[state]=[]
        }
        if(!MajorityState[state].hasOwnProperty(party)) {
            MajorityState[state][party]=0           
        }
        MajorityState[state][party]=parseInt(MajorityState[state][party]) + 1
    }
    
    let statePartyMap={}
    for(let state in MajorityState) {
        let maxParty='',maxCount=0
        for(let val in MajorityState[state]) {
            if(MajorityState[state][val]> maxCount) {
                maxCount=MajorityState[state][val]
                maxParty=val
            }
        }
        statePartyMap[state]={'party': maxParty, 'count': maxCount}
    }
    return  statePartyMap
}

export const getStates = (data) => {
    let states= new Set()
    data.forEach(row=> states.add(row[EXCEL_COLUMNS.STATE]))
    states = Array.from(states).sort(function(a,b) {
        return a > b
    })
    return states
}

export const getConstituencies = (data) => {
    let constituencies= new Set()
    data.forEach(row=> constituencies.add(row[EXCEL_COLUMNS.CONSTITUENCY]))
    constituencies = Array.from(constituencies).sort(function(a,b) {
        return a > b
    })
    return constituencies
}


export const stateVoting = (data) => {
    const ELECTORS='TOTAL_ELECTORS', VOTES='VOTES'

    let states = getStates(data)
    let stateMap = {}
    states.forEach( state => { 
        stateMap[state] =   {[ELECTORS]: 0, VOTES: 0 }
        let stateVotingMap = stateWiseVoting(data, state)
        Object.keys(stateVotingMap).forEach(constituency => {
            stateMap[state][ELECTORS] =  parseInt(stateMap[state][ELECTORS]) + parseInt(stateVotingMap[constituency][ELECTORS])
            stateMap[state][VOTES] = parseInt(stateMap[state][VOTES]) + parseInt(stateVotingMap[constituency][VOTES])
        })
    })
    
    return  stateMap
}

export const stateWiseVoting = (data, state) =>{
    let stateVotingMap={}
    const ELECTORS='TOTAL_ELECTORS', VOTES='VOTES'
    data= data.filter(row=> row[EXCEL_COLUMNS.STATE] === state)
    
    for(let i=0;i<data.length;i++) {
        let constituency= data[i][EXCEL_COLUMNS.CONSTITUENCY]
        if(!stateVotingMap.hasOwnProperty(constituency)) {
            stateVotingMap[constituency]={[ELECTORS]: parseInt(data[i][EXCEL_COLUMNS.TOTAL_ELECTORS]), 
                [VOTES]: 0}           
            }
            stateVotingMap[constituency][VOTES] =   parseInt(stateVotingMap[constituency][VOTES]) 
            + parseInt(data[i][EXCEL_COLUMNS.VOTES] || 0)            
        }
        return stateVotingMap   
    } 
    
    export const getBarChartData = (data) => {
        
        let winnerData = getWinnerData(data)
        let partyStateMap={}
        winnerData.sort(function(a, b){
            var x = a[EXCEL_COLUMNS.STATE].toLowerCase();
            var y = b[EXCEL_COLUMNS.STATE].toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        }); 
        
        for(let i=0;i<winnerData.length;i++) 
        {
            let party = winnerData[i][EXCEL_COLUMNS.PARTY], state = winnerData[i][EXCEL_COLUMNS.STATE]
            if(!partyStateMap.hasOwnProperty(party)) {
                partyStateMap[party]={}
            }
            if(!partyStateMap[party].hasOwnProperty(state)) {
                partyStateMap[party][state]= 0           
            }
            partyStateMap[party][state]=parseInt(partyStateMap[party][state]) + 1
        }
        return  partyStateMap
    }
    
    
    export const getStateWiseParty = (data) => {
        
        let partyStateMap={}
        
        for(let i=0;i<data.length;i++) 
        {
            let party = data[i][EXCEL_COLUMNS.PARTY], state = data[i][EXCEL_COLUMNS.STATE]
            if(!partyStateMap.hasOwnProperty(state)) {
                partyStateMap[state]=new Set()
            }
            partyStateMap[state].add(party)
        }
        return  partyStateMap
    }
    
    export const getPartyLegendState = (colorLegend, statePartyMap) => {
        for(let state in statePartyMap) {
            statePartyMap[state].color=colorLegend[statePartyMap[state].party]
        }
        return statePartyMap
    }
    


    export const getPieData = (data, state=null) => {
        let winnerData = getWinnerData(data)
        if (state!= null) {
            winnerData = winnerData.filter(row=> row[EXCEL_COLUMNS.STATE] === state)
        }
        let partyCountMap = {}
        for(let i=0;i<winnerData.length;i++) {
            let party = winnerData[i][EXCEL_COLUMNS.PARTY]
            if(!partyCountMap.hasOwnProperty(party)) {
                partyCountMap[party]=0
            }
            partyCountMap[party] = partyCountMap[party]+1
            }
            return partyCountMap
        }

        export const getBubbleChartData = (data, column) => {
            let constituencyMap={}
            for(let i=0;i<data.length;i++) {
                let constituency= data[i][column]
                if(!constituencyMap.hasOwnProperty(constituency)) {
                    constituencyMap[constituency]= []
                }
                constituencyMap[constituency].push(data[i])
            }
            let constituencies=[]
            let i=1
            for (let key in constituencyMap) {
                let arr=[]
                for(let j in constituencyMap[key]) {
                    let row=constituencyMap[key][j]
                    row.group=i
                    row.value=parseFloat(row[EXCEL_COLUMNS.POLLED_VOTES_PERC])
                    arr.push(row)
                }
                constituencies.push({'children':arr})
                i=i+1
            }
            constituencyMap={}
            constituencyMap.children=constituencies
            return constituencyMap
        }
            
    