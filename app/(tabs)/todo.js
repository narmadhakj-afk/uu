import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalBackground from '../../components/GlobalBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import NeonInput from '../../components/NeonInput';
import NeonButton from '../../components/NeonButton';
import { Plus, Check, MapPin, Clock } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

const TaskItem = ({ task, onToggle, onLocationPress, delay = 0 }) => (
  <Animatable.View
    animation="fadeInRight"
    duration={600}
    delay={delay}
    style={styles.taskItem}
  >
    <GlassmorphicCard style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        <View style={styles.taskLeft}>
          <Animatable.View
            animation={task.completed ? 'bounceIn' : undefined}
            duration={600}
            style={[styles.checkbox, task.completed && styles.checkedBox]}
          >
            {task.completed && <Check color="#fff" size={16} />}
          </Animatable.View>
          <View style={styles.taskInfo}>
            <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
              {task.title}
            </Text>
            {task.description && (
              <Text style={[styles.taskDescription, task.completed && styles.completedTaskDescription]}>
                {task.description}
              </Text>
            )}
            <View style={styles.taskMeta}>
              {task.dueTime && (
                <View style={styles.metaItem}>
                  <Clock color="#0099cc" size={12} />
                  <Text style={styles.metaText}>{task.dueTime}</Text>
                </View>
              )}
              {task.location && (
                <TouchableOpacity 
                  style={styles.metaItem}
                  onPress={() => onLocationPress(task.location)}
                >
                  <MapPin color="#00ff88" size={12} />
                  <Text style={styles.metaText}>{task.location}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </GlassmorphicCard>
  </Animatable.View>
);

export default function TodoScreen() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Buy groceries at Whole Foods',
      description: 'Milk, eggs, bread, and organic vegetables',
      completed: false,
      dueTime: '2:00 PM',
      location: 'Whole Foods Market',
    },
    {
      id: 2,
      title: 'Identify the red flower in the park',
      description: 'Use visual search to learn about the species',
      completed: true,
      dueTime: '10:30 AM',
      location: 'Central Park',
    },
    {
      id: 3,
      title: 'Meeting with design team',
      description: 'Review mockups and discuss user feedback',
      completed: false,
      dueTime: '4:00 PM',
      location: 'Office Building A',
    },
    {
      id: 4,
      title: 'Research coffee shops nearby',
      description: 'Find a good place for tomorrow\'s client meeting',
      completed: false,
      location: 'Downtown Area',
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTask = (taskId) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const handleLocationPress = (location) => {
    Alert.alert('Location', `Navigate to: ${location}`);
  };

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Smart Tasks</Text>
            <Text style={styles.subtitle}>AI-powered task management</Text>
          </View>

          {/* Progress Section */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.progressContainer}
          >
            <GlassmorphicCard style={styles.progressCard}>
              <View style={styles.progressContent}>
                <Text style={styles.progressTitle}>Today's Progress</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${progressPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedTasks} of {totalTasks} tasks completed
                </Text>
              </View>
            </GlassmorphicCard>
          </Animatable.View>

          {/* Add Task Button */}
          <View style={styles.addTaskContainer}>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setShowAddTask(true)}
            >
              <Plus color="#00ff88" size={24} />
              <Text style={styles.addTaskText}>Add New Task</Text>
            </TouchableOpacity>
          </View>

          {/* Add Task Form */}
          {showAddTask && (
            <Animatable.View
              animation="slideInUp"
              duration={600}
              style={styles.addTaskForm}
            >
              <GlassmorphicCard style={styles.addTaskCard}>
                <NeonInput
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  style={styles.addTaskInput}
                />
                <View style={styles.addTaskActions}>
                  <NeonButton
                    title="Cancel"
                    onPress={() => {
                      setShowAddTask(false);
                      setNewTaskTitle('');
                    }}
                    variant="secondary"
                    style={styles.cancelButton}
                  />
                  <NeonButton
                    title="Add Task"
                    onPress={addTask}
                    disabled={!newTaskTitle.trim()}
                    style={styles.addButton}
                  />
                </View>
              </GlassmorphicCard>
            </Animatable.View>
          )}

          {/* Tasks List */}
          <View style={styles.tasksContainer}>
            <Text style={styles.sectionTitle}>Your Tasks</Text>
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onLocationPress={handleLocationPress}
                delay={index * 100}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GlobalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#00ff88',
    opacity: 0.8,
    marginTop: 5,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressCard: {
    padding: 25,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 4,
  },
  progressText: {
    color: '#0099cc',
    fontSize: 14,
  },
  addTaskContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 15,
    borderStyle: 'dashed',
  },
  addTaskText: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  addTaskForm: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addTaskCard: {
    padding: 20,
  },
  addTaskInput: {
    marginBottom: 20,
  },
  addTaskActions: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  tasksContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  taskItem: {
    marginBottom: 15,
  },
  taskCard: {
    padding: 0,
    overflow: 'hidden',
  },
  completedTaskCard: {
    opacity: 0.7,
  },
  taskContent: {
    padding: 20,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00ff88',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#00ff88',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
    lineHeight: 20,
  },
  completedTaskDescription: {
    opacity: 0.6,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
});