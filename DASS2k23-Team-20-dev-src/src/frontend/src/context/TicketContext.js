import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from '../config';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
    const [isLoadingTicket, setIsLoadingTicket] = useState(false);
    const [createTicketSuccess, setCreateTicketSuccess] = useState(false);
    const [closeTicketSuccess, setCloseTicketSuccess] = useState(false);
    const [editTicketStatusSuccess, setEditTicketStatusSuccess] = useState(false);
    const [updateTicketSuccess, setUpdateTicketSuccess] = useState(false);
    const [ticketUpdates, setTicketUpdates] = useState([]);

    const [userTickets, setUserTickets] = useState([]);

    const createTicket = async (summary, description) => {
        let userToken = await AsyncStorage.getItem('userToken');
        console.log(summary, description);
        setIsLoadingTicket(true);
        axios
            .post(
                `${BASE_URL}/ticket`,
                {
                    Summary: summary,
                    Description: description
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            )
            .then(response => {
                setCreateTicketSuccess(true);
                console.log(response);
            })
            .catch(error => {
                setCreateTicketSuccess(false);
                console.log(error);
                alert(error.response.data.message);
            });
        setIsLoadingTicket(false);
    };

    const sortByDate = (tickets) => {
        tickets.sort((a, b) => {
            return new Date(b.CreatedOn) - new Date(a.CreatedOn);
        });
    };

    const sortTicketUpdatesByDate = (updates) => {
        updates.sort((a, b) => {
            return new Date(b.UpdatedOn) - new Date(a.UpdatedOn);
        });
    };

    const getTickets = async () => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .get(`${BASE_URL}/ticket`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    console.log(response.data);
                    sortByDate(response.data);
                    setUserTickets(response.data);
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data.message);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const closeTicket = async (ticketId) => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .put(
                    `${BASE_URL}/ticket/status/closed`,
                    {
                        TicketId: ticketId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    },
                )
                .then(response => {
                    console.log(response.data);
                    setCloseTicketSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                    setCloseTicketSuccess(false);
                    alert(error.response.data.message);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const getServiceTickets = async () => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .get(`${BASE_URL}/sp/getticket`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    console.log(response.data);
                    sortByDate(response.data);
                    setUserTickets(response.data);
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data.message);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const setWIPforTicket = async (ticketId) => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .put(
                    `${BASE_URL}/ticket/status/WIP`,
                    {
                        TicketId: ticketId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    },
                )
                .then(response => {
                    console.log(response.data);
                    setEditTicketStatusSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                    setEditTicketStatusSuccess(false);
                    alert(error.response.data.message);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const resolveTicket = async (ticketId) => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .put(
                    `${BASE_URL}/ticket/status/resolved`,
                    {
                        TicketId: ticketId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    },
                )
                .then(response => {
                    console.log(response.data);
                    setEditTicketStatusSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                    setEditTicketStatusSuccess(false);
                    alert(error.response.data.message);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const openTicket = async (ticketId) => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .put(
                    `${BASE_URL}/ticket/status/open`,
                    {
                        TicketId: ticketId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    },
                )
                .then(response => {
                    console.log(response.data);
                    setEditTicketStatusSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data.message);
                    setEditTicketStatusSuccess(false);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const assignTicket = async (ticketId, spEmail) => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .put(
                    `${BASE_URL}/ticket/status/assigned`,
                    {
                        TicketId: ticketId,
                        Email: spEmail,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    },
                )
                .then(response => {
                    console.log(response.data);
                    setEditTicketStatusSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data.message);
                    setEditTicketStatusSuccess(false);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const getAdminTickets = async () => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .get(`${BASE_URL}/ticket`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    console.log(response.data);
                    sortByDate(response.data);
                    setUserTickets(response.data);
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data.message);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const updateTicket = async (ticketId, update) => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .post(
                    `${BASE_URL}/ticket/update`,
                    {
                        TicketId: ticketId,
                        Update: update,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    },
                )
                .then(response => {
                    console.log(response.data);
                    setUpdateTicketSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data.message);
                    setUpdateTicketSuccess(false);
                });
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };

    const getTicketUpdates = async (ticketId) => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            setIsLoadingTicket(true);
            axios
                .get(`${BASE_URL}/ticket/update?id=${ticketId}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    console.log(response.data);
                    sortTicketUpdatesByDate(response.data);
                    setTicketUpdates(response.data);
                }
                )
                .catch(error => {
                    console.log(error);
                    alert(error.response.data.message);
                }
                );
            setIsLoadingTicket(false);
        } catch (error) {
            console.log(error);
            alert(error)
            setIsLoadingTicket(false);
        }
    };


        return (
            <TicketContext.Provider
                value={{
                    isLoadingTicket,
                    createTicket,
                    getTickets,
                    getServiceTickets,
                    userTickets,
                    createTicketSuccess,
                    setCreateTicketSuccess,
                    editTicketStatusSuccess,
                    setEditTicketStatusSuccess,
                    closeTicket,
                    closeTicketSuccess,
                    setCloseTicketSuccess,
                    setWIPforTicket,
                    resolveTicket,
                    openTicket,
                    assignTicket,
                    getAdminTickets,
                    updateTicket,
                    getTicketUpdates,
                    ticketUpdates,
                    setUpdateTicketSuccess,
                    updateTicketSuccess,
                }}
            >
                {children}
            </TicketContext.Provider>
        )
    }