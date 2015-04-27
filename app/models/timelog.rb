class Timelog
  include Filters
  include Mongoid::Document

  field :project_id, type: String
  field :project_name, type: String
  field :task_id, type: String
  field :task_name, type: String
  field :comment, type: String
  field :time, type: Float
  field :user_id, type: String
  field :fecha, type: Date
  field :trello, type: Boolean, default: true
  field :iteration_id, type: String
  field :value_ajust, type: Float, default: 0
  field :due_date, type: Date

  validates_presence_of :trello, :task_id
  validates_numericality_of :time, greater_than: 0

  scope :last_registered, -> (quantity=1){order_by(:fecha.desc).limit(quantity) }
  scope :by_range, -> (date_1,date_2) { where({ :fecha => date_1..date_2 }) }
  scope :by_project, ->(project_id) { where(:project_id => project_id) }
  scope :by_user, ->(user_id) { where(:user_id => user_id) }

  before_create do |timelog|
    iteration = Iteration.current_iteration(timelog.project_id)
    iteration.update_end_date 
    timelog.iteration_id = iteration.id if iteration
    timelog.set_project_name
    timelog.set_task_name
    timelog.set_value_ajust
  end

  after_initialize do |timelog|
    timelog.fecha ||= Date.today
  end

  def self.performance(search)
     timelogs = by_range(search[:date_1],search[:date_2])
     timelogs = timelogs.by_project(search[:project_id]) if search[:project_id]
     timelogs = timelogs.by_user(search[:user_id]) if search[:user_id]
     timelogs
  end

  def iteration 
    Iteration.where(id: iteration_id)
  end

  def set_project_name
    self.project_name ||= ProjectManager.new.project_name(project_id)
  end

  def set_task_name
    self.task_name ||= ProjectManager.new.task_name(task_id)
  end

  def user
    User.find(user_id)
  end

  def set_value_ajust
    self.value_ajust = user.apprentice? ? time / 3 : time
  end

  def time_worked
    time
  end

  def time_for_iteration
    value_ajust.nil? ? time : (value_ajust > 0 ? value_ajust : time)
  end

end
