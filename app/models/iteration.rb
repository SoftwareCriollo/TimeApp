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

  scope :by_project, ->(project_id) { where(:project_id => project_id) }

  def self.current_iteration(project)
    Iteration.where(:project_id => project, :start.lte => DateTime.now ).order_by(:start.asc).limit(1).last
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
end
