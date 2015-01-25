class Iteration
  include Mongoid::Document

  field :project_id, type: String
  field :time, type: Float
  field :note, type: String
  field :start, type: Date, default: DateTime.now
  field :end_date, type: Date, default: DateTime.now


  validates_presence_of :start, :end_date, :time
  validates_numericality_of :time

  has_many :timelogs

  def self.current_iteration(project)
    Iteration.where(:project_id => project, :start.lte => DateTime.now ).order_by(:start.asc).limit(1).last
  end

  def can_register_hours?
    time_wordked < time + 5
  end

  def time_wordked
    total_time =  timelogs.inject(0.0){|total,timelog| total += timelog.time_for_iteration }
    total_time.round(2)
  end  
end
