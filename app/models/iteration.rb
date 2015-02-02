class Iteration
  include Mongoid::Document

  field :project_id, type: String
  field :time, type: Float
  field :note, type: String
  field :start, type: Date, default: DateTime.now
  field :end_date, type: Date
  field :invoice, type: Integer

  validates_presence_of :start, :time
  validates_numericality_of :time

  has_many :timelogs

  scope :by_project, ->(project_id) { includes(:timelogs).where(:project_id => project_id) }

  before_create do |iteration|
    prev_iteration = Iteration.current_iteration(iteration.project_id)
    prev_iteration.close_iteration! if prev_iteration
  end

  def self.current_iteration(project)
    Iteration.where(:project_id => project, :start.lte => DateTime.now ).order_by(:start.asc).limit(1).last
  end

  def close_iteration!
    last_timelog = self.timelogs.last_registered(1).last
    self.end_date = last_timelog.fecha
    self.save
  end

  def can_register_hours?(total = 0)
    time_wordked + total < time + free_time
  end

  def remain_time
    (time + free_time)- time_wordked
  end

  def time_wordked
    total_time = timelogs.inject(0.0){|total,timelog| total += timelog.time_for_iteration }
    total_time.round(2)
  end  

  def free_time
    5
  end

  def as_json(options = nil)
    super(options).merge({time_worked: time_wordked})
  end
end
