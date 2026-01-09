import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const PermissionErrorScreen = () => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'light-content'} />
      {/* MAIN CARD */}
      <View style={styles.card}>
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}>
          {/* ICON */}
          <View style={styles.iconContainer}>
            <Feather
              name="slash"
              size={responsiveFontSize(3)}
              color="#e57373"
            />
          </View>

          {/* TITLE */}
          <Text style={styles.errorTitle}>403 - Access Denied</Text>

          {/* ALERT BOX */}
          <View style={styles.alertBox}>
            <MaterialIcons
              name="error-outline"
              size={responsiveFontSize(2.2)}
              color="#e65100"
            />
            <Text style={styles.alertText}>
              You do not have permission to access this page.
            </Text>
          </View>

          {/* BLUE CARD */}
          <View style={styles.blueCard}>
            <Text style={styles.blueCardTitle}>What can you do?</Text>

            <View style={styles.blueListRow}>
              <Feather
                name="check-circle"
                size={responsiveFontSize(2)}
                color="#00e676"
              />
              <Text style={styles.blueListText}>
                Contact your administrator
              </Text>
            </View>

            <View style={styles.blueListRow}>
              <Feather
                name="check-circle"
                size={responsiveFontSize(2)}
                color="#00e676"
              />
              <Text style={styles.blueListText}>
                Request the required permissions
              </Text>
            </View>

            <View style={styles.blueListRow}>
              <Feather
                name="check-circle"
                size={responsiveFontSize(2)}
                color="#00e676"
              />
              <Text style={styles.blueListText}>
                Verify your user role settings
              </Text>
            </View>
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.goBackBtn}>
              <Feather
                name="arrow-left"
                size={responsiveFontSize(2)}
                color="#fff"
              />
              <Text style={styles.goBackText}>Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardBtn}>
              <MaterialIcons
                name="dashboard"
                size={responsiveFontSize(2)}
                color="#555"
              />
              <Text style={styles.dashboardText}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <Text style={styles.footerText}>
            If you believe this is an error, contact support immediately.
          </Text>
          <Text style={styles.refText}>Reference: PERM_000_57_1765444981</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1f3f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(4),
  },

  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(4),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  iconContainer: {
    padding: responsiveHeight(2),
    borderRadius: 100,
    backgroundColor: '#ffeef0',
    marginBottom: responsiveHeight(1),
  },

  errorTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    marginBottom: responsiveHeight(2),
    color: '#000',
  },

  alertBox: {
    width: '100%',
    backgroundColor: '#fff8e1',
    padding: responsiveWidth(2),
    borderRadius: 8,
    marginBottom: responsiveHeight(2),
    borderLeftWidth: 3,
    borderLeftColor: '#ffb300',
    flexDirection: 'row',
    alignItems: 'center', // 🔥 Vertically aligns icon & text
  },

  alertText: {
    fontSize: responsiveFontSize(1.6),
    color: '#444',
    marginLeft: responsiveWidth(2), // 🔥 Gap between icon & text
    flexShrink: 1, // 🔥 Prevent overflow
  },

  blueCard: {
    width: '100%',
    backgroundColor: '#0288d1',
    padding: responsiveWidth(4),
    borderRadius: 12,
    marginBottom: responsiveHeight(3),
    elevation: 4,
  },

  blueCardTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#fff',
    marginBottom: responsiveHeight(1.5),
  },

  blueListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.8),
  },

  blueListText: {
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(2),
    color: '#fff',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: responsiveHeight(2),
  },

  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 8,
    marginRight: responsiveWidth(3),
  },

  goBackText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    marginLeft: responsiveWidth(1.5),
  },

  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(6),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  dashboardText: {
    color: '#555',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    marginLeft: responsiveWidth(1.5),
  },

  footerText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7),
    color: '#555',
    marginBottom: responsiveHeight(0.5),
  },

  refText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.6),
    color: '#888',
  },
});

export default PermissionErrorScreen;
