class ProjectManager
  include Serializer

  BOARD_ATTRIBUTES= [:id,:name,:description,:url]

  def initialize
    @organization = Trello::Organization.find(organization_name)
  end

  def boards
    @organization.boards
  end

  def boards_serialized
    arrays_object(boards,BOARD_ATTRIBUTES)
  end

  def organization_name
    'softwarecriollo'
  end

end