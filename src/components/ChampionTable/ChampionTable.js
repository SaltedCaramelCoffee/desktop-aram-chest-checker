import React from "react";
import "./_champion-table.scss";

class ChampionTable extends React.Component {

    hasCharacterInOrder = (text, searchTerm) => {
        // Return true if text includes characters from searchTerm in that order
        // For example, hasCharacterInOrder("Aurelion Sol", 'asol') will return true
        let index
        for (let i = 0; i < searchTerm.length; i ++ ) {
            index = text.indexOf(searchTerm[i])
            if (text.indexOf(searchTerm[i]) === -1) {
                return false
            } else {
                text = text.slice(index + 1)
            }
        }
        return true
    }

    createChampionTable = (term, filterOn) => {
        let table = [];
        Object.keys(this.props.championNameToId)
            .filter(key => this.hasCharacterInOrder(key, term))
            .forEach(champion => {
                const championId = this.props.championNameToId[champion];
                const championInfo = this.props.championsById[championId];

                if (filterOn) {
                  if (championInfo['chestGranted'] || !championInfo.owned) {
                    return;
                  }
                }

                const imgSource = `http://ddragon.leagueoflegends.com/cdn/${this.props.version}/img/champion/${championInfo['img']}`;

                let cssClass
                if (championInfo['chestGranted']) {
                    cssClass = "chest-acquired";
                } else if (championInfo.owned) {
                    cssClass = "available";
                } else {
                    cssClass = "not-owned"
                }
                table.push(
                    <div key={champion} className="cell">
                        <div className="champion-name">
                            {championInfo["name"]}
                        </div>
                        <div className="champion-info">
                            <img
                                className="img"
                                alt={champion}
                                src={imgSource}
                            />
                            <div className={cssClass}>
                            </div>
                        </div>
                    </div>
                );
            });
        return table;
    };

    render() {
        return (
            <div className="table">
            {this.createChampionTable(this.props.term, this.props.filterOn)}
            </div>
        );
    }
}

export default ChampionTable;
