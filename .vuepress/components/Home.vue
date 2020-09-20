<template>
    <div class="wrapper">
        <div class="info">
            <div class="header">Easily Add YFI and yUSD to Metamask.</div>
            <div class="description">
                This is a UI customization only.
            </div>
            <div class="description">No gas, no fees, no trading.</div>
            <div class="learn-wrap">
                <a
                    class="learn"
                    target="_blank"
                    href="https://www.learnyearn.finance/"
                    >Learn more</a
                >
            </div>
        </div>
        <div class="vault-wrap">
            <table>
                <tbody>
                    <tr
                        class="vault"
                        v-for="token in tokens"
                        :key="token.address"
                    >
                        <td class="row">
                            <img class="vault-image" v-bind:src="token.image" />
                        </td>
                        <td>
                            <div class="vault-name">
                                <a
                                    v-bind:href="
                                        'https://etherscan.io/address/' +
                                            token.address
                                    "
                                    target="_blank"
                                    >{{ token.symbol }}</a
                                >
                            </div>
                        </td>
                        <td>
                            <button
                                class="small-button"
                                @click="addToken(token)"
                            >
                                ADD TOKEN
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import browser from "../mixins/browser";
import dapp from "../mixins/dapp";
import fetch from "node-fetch";
import _ from "lodash";

export default {
    data() {
        return {
            tokens: [],
        };
    },
    mixins: [browser, dapp],

    created() {
        const setTokens = (vaults) => {
            const yUsdVault = _.find(vaults, { symbolAlias: "yUSD" });
            const yfiVault = _.find(vaults, { tokenSymbol: "YFI" });
            const yUsdToken = {
                symbol: yUsdVault.symbolAlias,
                address: yUsdVault.address,
                decimals: yUsdVault.decimals,
                image: yUsdVault.vaultIcon,
            };
            const yfiToken = {
                symbol: yfiVault.tokenSymbolAlias,
                address: yfiVault.tokenAddress,
                decimals: yfiVault.decimals,
                image: yfiVault.tokenIcon,
            };
            this.tokens = [yUsdToken, yfiToken];
        };
        fetch("https://api.yearn.tools/vaults")
            .then((response) => response.json())
            .then(setTokens);
    },
    mounted() {
        this.currentNetwork = "mainnet";
        this.initDapp();
    },

    methods: {
        async initDapp() {
            this.network.current = this.network.list[this.currentNetwork];
            try {
                await this.initWeb3(this.currentNetwork, true);
                // await this.getToken(this.getParam("address"));
            } catch (e) {
                alert(e);
                document.location.href = this.$withBase("/");
            }
        },
        async addToken(token) {
            const transaction = this.getTransaction(token);

            if (!this.metamask.installed) {
                alert("Please install MetaMask and try again!");
                return;
            }
            const self = this;

            const sendAsync = (call) => {
                return new Promise(function(resolve, reject) {
                    self.web3Provider.sendAsync(call, function(error, result) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                });
            };

            await sendAsync(transaction);
        },
        getTransaction(token) {
            return {
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: token.address,
                        symbol: token.symbol,
                        decimals: token.decimals,
                        image: token.image,
                    },
                },
                id: Math.round(Math.random() * 100000),
            };
        },
    },
};
</script>
