import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { TicketContext } from "../../../context/TicketContext";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { AuthContext } from "../../../context/AuthContext";

function OpenTicketsCard({ navigation, tickets }) {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("TicketDetailsPage", {
                        tickets: tickets
                    });
                }}>
                <Text style={styles.heading}>View Open Tickets</Text>

            </TouchableOpacity>
        </View>
    );
}

function AssignedTicketsCard({ navigation, tickets }) {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("TicketDetailsPage", {
                        tickets: tickets
                    });
                }}>
                <Text style={styles.heading}>View Assigned Tickets</Text>

            </TouchableOpacity>
        </View>
    );
}

function WipTicketsCard({ navigation, tickets }) {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("TicketDetailsPage", {
                        tickets: tickets
                    });
                }}>
                <Text style={styles.heading}>View In Progress Tickets</Text>

            </TouchableOpacity>
        </View>
    );
}

function ResolvedTicketsCard({ navigation, tickets }) {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("TicketDetailsPage", {
                        tickets: tickets
                    });
                }}>
                <Text style={styles.heading}>View Resolved Tickets</Text>

            </TouchableOpacity>
        </View>
    );
}

function ClosedTicketsCard({ navigation, tickets }) {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("TicketDetailsPage", {
                        tickets: tickets
                    });
                }}>
                <Text style={styles.heading}>View Closed Tickets</Text>

            </TouchableOpacity>
        </View>
    );
}

export default function DetailsScreen({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAdminTickets();
        setRefreshing(false);
    }, []);

    const { getAdminTickets, userTickets, closeTicketSuccess, setCloseTicketSuccess, editTicketStatusSuccess, setEditTicketStatusSuccess, updateTicketSuccess, setUpdateTicketSuccess } = useContext(TicketContext);

    const [OpenTickets, setOpenTickets] = useState([]);
    const [AssignedTickets, setAssignedTickets] = useState([]);
    const [WipTickets, setWipTickets] = useState([]);
    const [ResolvedTickets, setResolvedTickets] = useState([]);
    const [ClosedTickets, setClosedTickets] = useState([]);

    useEffect(() => {
        getAdminTickets();
    }, []);

    useEffect(() => {
        if (closeTicketSuccess) {
            getAdminTickets();
            setCloseTicketSuccess(false);
        }
    }, [closeTicketSuccess]);

    useEffect(() => {
        if (editTicketStatusSuccess) {
            getAdminTickets();
            setEditTicketStatusSuccess(false);
        }
    }, [editTicketStatusSuccess]);

    useEffect(() => {
        if (updateTicketSuccess) {
            getAdminTickets();
            setUpdateTicketSuccess(false);
        }
    }, [updateTicketSuccess]);

    useEffect(() => {
        if (userTickets) {
            setOpenTickets(userTickets.filter(ticket => ticket["Status"] === "Open"));
            setAssignedTickets(userTickets.filter(ticket => ticket["Status"] === "Assigned"));
            setWipTickets(userTickets.filter(ticket => ticket["Status"] === "WIP"));
            setResolvedTickets(userTickets.filter(ticket => ticket["Status"] === "Resolved"));
            setClosedTickets(userTickets.filter(ticket => ticket["Status"] === "Closed"));
        }
    }, [userTickets]);

    return (
        <View style={styles.root}>
            <CustomButton
                text="Create New Ticket"
                onPress={() => navigation.navigate('NewTicket')}
            />
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <OpenTicketsCard
                    navigation={navigation}
                    tickets={OpenTickets}
                />
                <AssignedTicketsCard
                    navigation={navigation}
                    tickets={AssignedTickets}
                />
                <WipTicketsCard
                    navigation={navigation}
                    tickets={WipTickets}
                />
                <ResolvedTicketsCard
                    navigation={navigation}
                    tickets={ResolvedTickets}
                />
                <ClosedTicketsCard
                    navigation={navigation}
                    tickets={ClosedTickets}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 12,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "black",
        margin: 12,
        padding: 12,
        borderRadius: 8,
        shadowColor: "#000",
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
});