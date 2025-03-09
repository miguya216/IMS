<?php function messages(){ ?>
    <div class="list-group shadow-lg"> <!-- Use form-box instead of card -->
            <h4 class="text-center">SMS</h4>
            <form id="sms">
                <div class="row">
                <ul>
                    <div>
                        <div class="mb-4">
                        <li class="list-group-item">
                                <strong>Custodian A:</strong> "Reminder: Return borrowed laptops by Friday."
                                <span class="badge bg-warning text-dark">Urgent</span>
                            </li>
                            </div>
                    </div>

                    <div>
                        <div class="mb-4">
                        <li class="list-group-item">
                                <strong>Custodian B:</strong> "Projector maintenance scheduled for 2 PM today."
                                <span class="badge bg-primary">Info</span>
                            </li>
                            </div>
                    </div>

                    <div>
                        <div class="mb-4">
                        <li class="list-group-item">
                                <strong>Custodian C:</strong> "Lab chairs need urgent repairs. Please process the request."
                                <span class="badge bg-danger">Action Required</span>
                            </li>
                            </div>
                    </div>

                    <div>
                        <div class="mb-4">
                        <li class="list-group-item">
                                <strong>Admin:</strong> "New equipment delivery expected next week."
                                <span class="badge bg-success">Update</span>
                            </li>
                            </div>
                    </div>

                    <div>
                        <div class="mb-4">
                        <li class="list-group-item">
                                <strong>Custodian D:</strong> "Reminder: Inventory audit scheduled for next Monday."
                                <span class="badge bg-secondary">Reminder</span>
                            </li>
                        </div>
                    </div>
                </ul>
                
                </div>
               
            </form>
    </div>

<?php } ?>


               