require "rails_helper"

RSpec.describe TimeLogger, :type => :model do
  let(:user) { create(:user) }
  before(:each) do
    User.destroy_all
    Iteration.destroy_all
    Timelog.destroy_all
    stubbing
  end
  subject{ TimeLogger.new(user)}

  let!(:iteration){ create(:iteration, project_id:"is-an-id",start: DateTime.now - 1.day)}



  describe "validate" do
    describe "presence" do
      it { is_expected.to validate_presence_of(:project_name) }
      it { is_expected.to validate_presence_of(:project_id) }
    end
  end
  describe "#register" do
    let(:timelog_1){ attributes_for(:timelog)}
    let(:timelog_2){ attributes_for(:timelog)}
    let(:attributes){ {project_id: "is-an-id", project_name: "this is my name", timelogs_attributes: [timelog_1,timelog_2]}}

    let(:time_logger){ TimeLogger.new(user)}
    
    it{ expect{ time_logger.create(attributes) }.to change{Timelog.count}.by(2) }

  end
end
