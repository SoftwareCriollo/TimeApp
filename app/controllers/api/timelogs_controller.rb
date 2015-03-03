class Api::TimelogsController <  ApiAuthenticatedController

  def create
    @timelogs = TimeLogger.new(current_user)
    if @timelogs.create(timelogger_params)
      render json: @timelogs, status: 201, notice: "Successfully created Timelog"
    else
      render json: @timelogs.errors.messages, status: 422
    end
  end

  def update
    @timelog = Timelog.find(params[:id])
    if @timelog.update(timelog_params)
      render json: @timelog, status: 201, notice: "Successfully updated Timelog"
    else
      render json: @timelog.errors.messages, status: 422
    end
  end

  def index
    @timelogs = Timelog.by_range(params[:date_1],params[:date_2])
    @timelogs = @timelogs.filtering_params(params.slice(:project_id, :user_id))

    render json: @timelogs
  end

  def timelog_params
    params.require(:timelog).permit(:time,:comment)
  end

  def timelogger_params
    params.require(:timelogger).permit(:project_id, :project_name, timelogs_attributes: timelog_attributes)
  end

  def timelog_attributes
    [:task_id,:task_name, :comment, :time]
  end

end
