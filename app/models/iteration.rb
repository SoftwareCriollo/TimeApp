class Iteration
  include Mongoid::Document

  field :project_id, type: String
  field :time, type: Float
  field :note, type: String
  field :start, type: Date, default: DateTime.now
  field :end_date, type: Date
  field :invoice, type: Integer

  validates_presence_of :start, :time
  validates_numericality_of :time, :greater_than => 1.0
  
  scope :by_project, ->(project_id) { where(:project_id => project_id).order_by(:start.desc) }
  scope :closed, -> {where(end_date: nil)}
  
  before_create do |iteration|
    prev_iteration = Iteration.current_iteration(iteration.project_id)
    prev_iteration.close_iteration! if prev_iteration
  end

  def timelogs
    Timelog.where(iteration_id: self.id)
  end

  def self.current_iteration(project)
    where(:project_id => project, :start.lte => DateTime.now ).order_by(:start.desc).limit(1).first
  end

  def close_iteration!
    last_timelog = self.timelogs.last_registered(1).first
    self.end_date = last_timelog.fecha
    self.save
  end
  
  def update_dates
    self.start = first_log_date
    self.end_date = last_log_date
    self.save
  end  
  
  def first_log_date
    self.timelogs.order_by(:fecha.asc).first.fecha
  end  
  
  def update_end_date
    end_date = last_log_date
    self.save
  end
  
  def last_log_date
    last = self.timelogs.order_by(:fecha.asc).last
    last ? last.fecha : DateTime.now
  end   
  
  def can_register_hours?
    time_for_iteration < time 
  end

  def remain_time
    time - time_for_iteration
  end

  def time_worked
    timelogs.map(&:time_worked).inject(0.0,:+).round(2)
  end  
  
  def time_for_iteration
    timelogs.map(&:time_for_iteration).inject(0.0,:+).round(2)
  end  


  def as_json(options = {})
    super({methods: [:time_for_iteration]}.merge(options))
  end

end
