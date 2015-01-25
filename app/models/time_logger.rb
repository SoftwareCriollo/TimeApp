class TimeLogger
  include ActiveModel::Model

  attr_accessor :project_name, :project_id, :user, :timelogs_attributes, :timelogs

  validates_presence_of :project_id, :project_name

  def initialize(user)
    @user = user
    @timelogs = []
  end

  def create(attributes)
    @attributes = attributes
    config_params
    config_timelogs
    if valid?
      save
    else
      puts errors.messages.inspect
    end
  end

  def config_params
    self.project_name = @attributes[:project_name]
    self.project_id = @attributes[:project_id]
  end

  def save
    timelogs.map(&:save)
  end

  def valid?
    validate_timelogs
    super
  end

  private

  def validate_timelogs
    time = 0
    timelogs.each do |timelog|
      time += timelog.time 
      errors.add( :timelogs, timelog.errors.messages) unless timelog.valid?
    end
    validate_timeleft_iteration(time)
  end

  def validate_timeleft_iteration(total)
    iteration = Iteration.current_iteration(project_id)
    if iteration.nil?
      errors.add(:project_id, "We don't have a valid iteration")      
    elsif iteration.can_register_hours?(total)
      errors.add(:project_id, "Can't log #{total} hours. Remain time: #{iteration.remain_time}")
    end
  end

  def config_timelogs
    @attributes[:timelogs_attributes].each do |attr_timelog|
      attr_timelog[:project_id] = project_id
      attr_timelog[:project_name] = project_name
      attr_timelog[:user_id] = user.id
      time = Timelog.new(attr_timelog)
      self.timelogs << time
    end
  end
end
