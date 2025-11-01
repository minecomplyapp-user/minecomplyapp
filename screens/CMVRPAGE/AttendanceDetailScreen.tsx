import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '../../components/CustomHeader';

interface Person {
  id: string;
  name: string;
  position: string;
  status: 'present' | 'absent' | 'late';
  timeIn?: string;
  timeOut?: string;
}

interface AttendanceDetailScreenProps {
  navigation: any;
  route: any;
}

const AttendanceDetailScreen: React.FC<AttendanceDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { record } = route.params;

  // Sample attendance data
  const [people, setPeople] = useState<Person[]>([
    {
      id: '1',
      name: 'John Doe',
      position: 'Engineer',
      status: 'present',
      timeIn: '8:00 AM',
      timeOut: '5:00 PM',
    },
    {
      id: '2',
      name: 'Jane Smith',
      position: 'Manager',
      status: 'present',
      timeIn: '8:15 AM',
      timeOut: '5:30 PM',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      position: 'Technician',
      status: 'late',
      timeIn: '9:30 AM',
      timeOut: '5:00 PM',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      position: 'Supervisor',
      status: 'absent',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    position: '',
    status: 'present' as 'present' | 'absent' | 'late',
    timeIn: '',
    timeOut: '',
  });

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.position) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const person: Person = {
      id: Date.now().toString(),
      name: newPerson.name,
      position: newPerson.position,
      status: newPerson.status,
      timeIn: newPerson.timeIn || undefined,
      timeOut: newPerson.timeOut || undefined,
    };

    setPeople([...people, person]);
    setModalVisible(false);
    setNewPerson({
      name: '',
      position: '',
      status: 'present',
      timeIn: '',
      timeOut: '',
    });
  };

  const handleDeletePerson = (id: string) => {
    Alert.alert(
      'Delete Person',
      'Are you sure you want to remove this person from attendance?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setPeople(people.filter((p) => p.id !== id)),
        },
      ]
    );
  };

  const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late') => {
    setPeople(
      people.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#10B981';
      case 'absent':
        return '#EF4444';
      case 'late':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return 'checkmark-circle';
      case 'absent':
        return 'close-circle';
      case 'late':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  const stats = {
    total: people.length,
    present: people.filter((p) => p.status === 'present').length,
    absent: people.filter((p) => p.status === 'absent').length,
    late: people.filter((p) => p.status === 'late').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader showSave={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{record.title}</Text>
              <Text style={styles.date}>{record.date}</Text>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>
                {stats.present}
              </Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.statNumber, { color: '#EF4444' }]}>
                {stats.absent}
              </Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
                {stats.late}
              </Text>
              <Text style={styles.statLabel}>Late</Text>
            </View>
          </View>
        </View>

        {/* Add Person Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="person-add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Person</Text>
        </TouchableOpacity>

        {/* Attendance List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance List</Text>
          
          {people.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyStateText}>No attendance records yet</Text>
            </View>
          ) : (
            people.map((person) => (
              <View key={person.id} style={styles.personCard}>
                <View style={styles.personHeader}>
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personPosition}>{person.position}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.deleteIconButton}
                    onPress={() => handleDeletePerson(person.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {/* Status Badges */}
                <View style={styles.statusRow}>
                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      person.status === 'present' && styles.statusBadgeActive,
                      { borderColor: '#10B981' },
                    ]}
                    onPress={() => handleStatusChange(person.id, 'present')}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={person.status === 'present' ? '#10B981' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        person.status === 'present' && { color: '#10B981' },
                      ]}
                    >
                      Present
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      person.status === 'late' && styles.statusBadgeActive,
                      { borderColor: '#F59E0B' },
                    ]}
                    onPress={() => handleStatusChange(person.id, 'late')}
                  >
                    <Ionicons
                      name="time"
                      size={16}
                      color={person.status === 'late' ? '#F59E0B' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        person.status === 'late' && { color: '#F59E0B' },
                      ]}
                    >
                      Late
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      person.status === 'absent' && styles.statusBadgeActive,
                      { borderColor: '#EF4444' },
                    ]}
                    onPress={() => handleStatusChange(person.id, 'absent')}
                  >
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={person.status === 'absent' ? '#EF4444' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        person.status === 'absent' && { color: '#EF4444' },
                      ]}
                    >
                      Absent
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Time Info */}
                {person.status !== 'absent' && (
                  <View style={styles.timeRow}>
                    <View style={styles.timeItem}>
                      <Ionicons name="log-in-outline" size={16} color="#64748B" />
                      <Text style={styles.timeLabel}>Time In:</Text>
                      <Text style={styles.timeValue}>
                        {person.timeIn || 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.timeItem}>
                      <Ionicons name="log-out-outline" size={16} color="#64748B" />
                      <Text style={styles.timeLabel}>Time Out:</Text>
                      <Text style={styles.timeValue}>
                        {person.timeOut || 'Not set'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Person Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Person</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                value={newPerson.name}
                onChangeText={(text) =>
                  setNewPerson({ ...newPerson, name: text })
                }
              />

              <Text style={styles.inputLabel}>Position *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter position"
                value={newPerson.position}
                onChangeText={(text) =>
                  setNewPerson({ ...newPerson, position: text })
                }
              />

              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusSelector}>
                {(['present', 'late', 'absent'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      newPerson.status === status && styles.statusOptionActive,
                      { borderColor: getStatusColor(status) },
                    ]}
                    onPress={() =>
                      setNewPerson({ ...newPerson, status })
                    }
                  >
                    <Ionicons
                      name={getStatusIcon(status) as any}
                      size={20}
                      color={
                        newPerson.status === status
                          ? getStatusColor(status)
                          : '#94A3B8'
                      }
                    />
                    <Text
                      style={[
                        styles.statusOptionText,
                        newPerson.status === status && {
                          color: getStatusColor(status),
                        },
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {newPerson.status !== 'absent' && (
                <>
                  <Text style={styles.inputLabel}>Time In</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 8:00 AM"
                    value={newPerson.timeIn}
                    onChangeText={(text) =>
                      setNewPerson({ ...newPerson, timeIn: text })
                    }
                  />

                  <Text style={styles.inputLabel}>Time Out</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 5:00 PM"
                    value={newPerson.timeOut}
                    onChangeText={(text) =>
                      setNewPerson({ ...newPerson, timeOut: text })
                    }
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddPerson}
              >
                <Text style={styles.confirmButtonText}>Add Person</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    marginBottom: 20,
  },
  titleContainer: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  date: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#02217C',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#02217C',
    padding: 16,
    borderRadius: 10,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 12,
  },
  personCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  personPosition: {
    fontSize: 13,
    color: '#64748B',
  },
  deleteIconButton: {
    padding: 4,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 4,
  },
  statusBadgeActive: {
    backgroundColor: '#FFFFFF',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  timeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  statusOptionActive: {
    backgroundColor: '#FFFFFF',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmButton: {
    backgroundColor: '#02217C',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AttendanceDetailScreen;