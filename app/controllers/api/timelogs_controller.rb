class Api::TimelogsController <  ApiAuthenticatedController

  def create
    @timelogs = TimeLogger.new(current_user)
    if @timelogs.create(timelog_params)
      render json: @timelogs, status: 201, notice: "Successfully created Timelog"
    else
      render json: @timelogs.errors.messages, status: 422
    end
  end

  def index
    @iterations = TimeLog.by_iteration(params[:iteration_id])
    render json: @timelogs
  end

  def timelog_params
    params.require(:timelogger).permit(:project_id, :project_name, timelogs_attributes: timelog_attributes)
  end

  def timelog_attributes
    [:task_id,:task_name, :comment, :time]
  end

end
