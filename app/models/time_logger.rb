class TimeLogger
  include ActiveModel::Model
  include Mongoid::Document

  attr_accessor :project_name, :iteration_id, :project_id, :user, :timelogs_attributes, :timelogs

  validates_presence_of :project_id, :project_name

  scope :by_iteration, ->(iteration_id) { where(:iteration_id => iteration_id) }

  def initialize(user)
    @user = user
    @timelogs = []
  end

  def create(attributes)
    @attributes = attributes
    config_params
    config_timelogs
    valid? ? save : false
  end

  def config_params
    @project_id = @attributes[:project_id]
    @project_name = @attributes[:project_name]
  end

  def save
    @timelogs.map(&:save)
  end

  def valid?
    super
    validate_timelogs if errors.empty?
    return errors.empty?
  end


  private

  def validate_timelogs
    time = 0
    @timelogs.each do |timelog|
      time += timelog.time 
      errors.add(:timelogs, timelog.errors.messages) unless timelog.valid?
    end
    validate_timeleft_iteration
  end

  def validate_timeleft_iteration
    iteration = Iteration.current_iteration(project_id)
    if iteration.nil?
      errors.add(:project_id, "We don't have a valid iteration")
    elsif !iteration.can_register_hours?
      errors.add(:project_id, "Can't log more hours")
    end
  end

  def config_timelogs
    return nil if @attributes[:timelogs_attributes].nil?
    @attributes[:timelogs_attributes].each do |attr_timelog|
      attr_timelog[:project_id] = @project_id
      attr_timelog[:project_name] = @project_name
      attr_timelog[:user_id] = @user.id
      @timelogs << Timelog.new(attr_timelog)
    end
  end
end
