import React from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import ChampionTable from "../../components/ChampionTable/ChampionTable";
import Button from "../../components/Button/Button";
import Toggle from "../../components/Toggle/Toggle";
import Default from "../Default/Default";

import "./_filter-champion.scss";

const request = window.require("request-promise-native");

class FilterChampion extends React.Component {
    fetchGameData = async () => {
        const requestClient = request.defaults({
            headers: {
                Accept: "application/json"
            },
            json: true
        });

        const version = await requestClient({
            uri: "https://ddragon.leagueoflegends.com/api/versions.json"
        });

        this.setState({version: version[0]});

        const championData = await requestClient({
            uri: `https://ddragon.leagueoflegends.com/cdn/${
                this.state.version
            }/data/en_US/champion.json`
        });

        this.setState({championData: championData["data"]});
    };

    fetchLeagueData = async () => {
        const creds = this.props.credential;
        const defaultOptions = {
            baseUrl: `${creds.protocol}://${creds.address}:${creds.port}`,
            headers: {
                Accept: "application/json",
                Authorization:
                    "Basic " +
                    Buffer.from(`${creds.username}:${creds.password}`).toString(
                        "base64"
                    )
            },
            json: true,
            rejectUnauthorized: false
        };
        const requestClient = request.defaults(defaultOptions);

        const currentSummoner = await requestClient({
            uri: "/lol-summoner/v1/current-summoner"
        })
            .then(data => {
                return data;
            })
            .catch(err => {
                console.log(err);
                this.setState({screen: "Error"});
                return {};
            });

        const availableChests = await requestClient({
            uri: "/lol-collections/v1/inventories/chest-eligibility"
        })
            .then(data => {
                return data;
            })
            .catch(err => {
                console.log(err);
                this.setState({screen: "Error"});
                return {};
            });

        const ownedChampions = await requestClient({
            uri: "/lol-champions/v1/owned-champions-minimal"
        })
            .then(data => {
                return data;
            })
            .catch(err => {
                console.log(err);
                this.setState({screen: "Error"});
                return {};
            });

        const championMastery = await requestClient({
            uri: `/lol-collections/v1/inventories/${
                currentSummoner.summonerId
            }/champion-mastery`
        })
            .then(data => {
                return data;
            })
            .catch(err => {
                console.log(err);
                this.setState({screen: "Error"});
                return {};
            });

        this.setState({
            currentSummoner,
            availableChests,
            ownedChampions,
            championMastery
        });
    };

    cleanData = () => {
        // This is the response from DDragon API Champion call
        const championData = this.state.championData;

        const championNameToId = {};
        const championsById = {};

        Object.values(championData).forEach(champion => {
            const championName = champion["name"]
                .replace(/\W/g, "")
                .toLowerCase();

            const championId = champion["key"];

            championNameToId[championName] = championId;

            championsById[championId] = {
                name: champion["name"],
                img: champion["image"]["full"]
            };
        });

        this.setState({championNameToId});

        // Champion Mastery data in a dictionary with key as champion ID

        const ownedChampions = this.state.ownedChampions;
        const championMastery = this.state.championMastery;

        // Mark which champions are owned

        Object.values(ownedChampions).forEach(champion => {
            if (champion["ownership"]["owned"]) {
                championsById[champion["id"]]["owned"] = true;
            } else {
                championsById[champion["id"]]["owned"] = false;
            }
        });

        Object.values(championMastery).forEach(champion => {
            const id = champion["championId"];

            // Somehow I can have mastery on champions I don't own...
            if (championsById[id]) {
                championsById[id]["chestGranted"] = champion["chestGranted"];
            }
        });

        this.setState({championsById});
        if (this.state.screen !== "Error") {
            this.setState({screen: "Success"});
        }
    };

    refresh = async () => {
        await this.fetchGameData();
        await this.fetchLeagueData();
        this.cleanData();
    };

    onInputChange = data => {
        this.setState({term: data});
    };

    onButtonClick = () => {
        this.setState({screen: "Loading"});
        this.refresh();
    };

    onToggleChange = () => {
        this.setState({filterOn: !this.state.filterOn})
    }

    onFormSubmit = () => {};

    constructor(props) {
        super(props);
        this.state = {
            filterOn: true,
            screen: "Loading",
            term: "",
            version: "",
            currentSummoner: {},
            availableChests: {},
            championData: {},
            ownedChampions: {},
            championMastery: {},
            championNameToId: {},
            championsById: {}
        };
        this.refresh();
    }

    render() {
        // Fetch for data. If user not logged in, show that user needs to log in
        // and give them a button to refresh.

        if (this.state.screen === "Success") {
            return (
                <div className="shell bx--grid">
                    <div className="bx--row">
                    <div className="bx--col summoner">
                        {this.state.currentSummoner.displayName}
                    </div>
                    <div className="bx--col">
                      <div className="align-right">
                      <Button text="Refresh" onButtonClick={this.onButtonClick} />
                      </div>
                    </div>
                    </div>
                    <div className="bx--row row">
                        <div className="bx--col chest-status">
                          Available number of chests:{" "}
                          {this.state.availableChests.earnableChests}
                        </div>
                        <div className="bx--col toggle">
                        <Toggle onChange={this.onToggleChange}/>
                        </div>
                    </div>
                    <div className="filter">
                    <SearchBar
                        label=""
                        placeholderText="Search for champions here"
                        term={this.state.term}
                        onChange={this.onInputChange}
                        onSubmit={this.onFormSubmit}
                    />
                    </div>
                    <ChampionTable
                        className="table"
                        term={this.state.term.replace(/\W/g, "").toLowerCase()}
                        filterOn={this.state.filterOn}
                        version={this.state.version}
                        championNameToId={this.state.championNameToId}
                        championsById={this.state.championsById}
                    />
                </div>
            );
        } else if (this.state.screen === "Error") {
            return (
                <div className="shell">
                    <Default message="Please log into League of Legends" />
                    <Button text="Refresh" onButtonClick={this.onButtonClick} />
                </div>
            );
        } else {
            return (
                <div className="shell">
                    <Default message="Loading" />
                </div>
            );
        }
    }
}

export default FilterChampion;
